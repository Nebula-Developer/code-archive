const Place = require('../models/Place');
const User = require('../models/User');
const { Socket, Server } = require('socket.io');
const io = require('../io');

var userTimers = {}
var cooldown = 0;

var placeWidth = 100;
var placeHeight = 100;

var palettes = {
    "Basic": [
        "white",
        "black",
        "red",
        "lime",
        "blue",
        "yellow",
        "cyan",
        "magenta",
        "silver",
        "gray",
        "maroon",
        "olive",
        "green",
        "purple",
        "teal",
        "navy"
    ],  
    "Warm Beige":  [
        "#454545",
        "#FF6000",
        "#FFA559",
        "#FFE6C7"
    ],
    "Neon Tokyo": [
        "#191825",
        "#865DFF",
        "#E384FF",
        "#FFA3FD"
    ],
    "Retro Arcade": [
        "#22A699",
        "#F2BE22",
        "#F29727",
        "#F24C3D"
    ],
    "Kids Summer": [
        "#FFB84C",
        "#F266AB",
        "#A459D1",
        "#2CD3E1"
    ],
    "Vintage Coffee": [
        "#F3EEEA",
        "#EBE3D5",
        "#B0A695",
        "#776B5D"
    ],
    "Light Lavender": [
        "#F1EAFF",
        "#E5D4FF",
        "#DCBFFF",
        "#D0A2F7"
    ],
    "Sunset": [
        "#F9ED69",
        "#F08A5D",
        "#B83B5E",
        "#6A2C70"
    ]
}

// create the shades of each color:
var shades = [
    [], [], [], [], [], []
];
for (var r = 0; r < 256; r += 51) {
    for (var g = 0; g < 256; g += 51) {
        var i = 0;
        for (var b = 0; b < 256; b += 51) {
            shades[i].push(`rgb(${r},${g},${b})`);
            i++;
        }
    }
}

shades = [
    ...shades[0],
    ...shades[1],
    ...shades[2],
    ...shades[3],
    ...shades[4],
    ...shades[5]
]

// sort 
shades.sort((a, b) => {
    var aSplit = a.split(',');
    var bSplit = b.split(',');
    var aSum = 0;
    var bSum = 0;
    for (var i = 0; i < 3; i++) {
        aSum += parseInt(aSplit[i]);
        bSum += parseInt(bSplit[i]);
    }
    return aSum - bSum;
});


// add the shades to the palettes:
palettes['All Colors'] = shades;

module.exports =
/**
 * @param {Socket} socket 
 */
(socket) => {
    // if at /place
    if (socket.handshake.headers.referer.includes('/place')) {
        socket.join('place');

        // get place
        Place.findAll().then(places => {
            socket.emit('places', places);
        });

        socket.emit('cooldown', cooldown);
        socket.emit('colors', palettes);

        socket.emit('placeSize', {
            width: placeWidth,
            height: placeHeight
        });
    }

    socket.on('place', async (data, callback) => {
        console.log(socket.request.session);
        if (!socket.request.session.user) {
            callback({
                error: 'You must be logged in to place a pixel.'
            });
            return;
        }

        if (userTimers[socket.request.session.user.id] && Date.now() - userTimers[socket.request.session.user.id] < cooldown * 1000) {
            callback({
                error: 'You must wait ' + cooldown + ' seconds between placing pixels.',
                code: 'PLACE_COOLDOWN',
                cooldown
            });
            return;
        }

        userTimers[socket.request.session.user.id] = Date.now();

        try {
            if (data.x < 0 || data.x >= placeWidth || data.y < 0 || data.y >= placeHeight) {
                throw new Error('Invalid coordinates.');
            }

            const place = await Place.findOne({
                where: {
                    x: data.x,
                    y: data.y
                }
            });


            var colorSplit = data.color.split(',');
            if (colorSplit.length != 2 || !palettes[colorSplit[0]] || !palettes[colorSplit[0]][colorSplit[1]]) {
                throw new Error('Invalid color.');
            }

            if (place) {
                place.color = data.color;
                await place.save();
            } else {
                await Place.create({
                    x: data.x,
                    y: data.y,
                    color: data.color,
                    userId: socket.request.session.user.id
                });
            }

            io.to('place').emit('place', data);

            callback({
                success: true
            });
        } catch (error) {
            callback({
                error: error.message
            });
        }
    });

    socket.on('getPixelOwner', async (data, callback) => {
        try {
            const place = await Place.findOne({
                where: {
                    x: data.x,
                    y: data.y
                }
            });

            if (place) {
                await User.findOne({
                    where: {
                        id: place.userId
                    }
                }).then(user => {
                    delete user.password;
                    
                    callback({
                        owner: user
                    });
                });
            } else {
                callback({
                    owner: null
                });
            }
        } catch (error) {
            callback({
                error: error.message
            });
        }
    });
}