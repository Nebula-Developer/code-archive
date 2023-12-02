const Place = require('../models/Place');
const { Socket, Server } = require('socket.io');

var userTimers = {}
var cooldown = 3;

var colors = [
    "white",
    "rgb(228, 228, 228)",
    "rgb(136, 136, 136)",
    "rgb(34, 34, 34)",
    "black",
    "rgb(255, 167, 209)",
    "rgb(229, 0, 0)",
    "rgb(229, 149, 0)",
    "rgb(160, 106, 66)",
    "rgb(229, 217, 0)",
    "rgb(148, 224, 68)",
    "rgb(2, 190, 1)",
    "rgb(0, 211, 221)",
    "rgb(0, 131, 199)",
    "rgb(0, 0, 234)",
    "rgb(207, 110, 228)",
    "rgb(130, 0, 128)"
];

module.exports =
/**
 * @param {Server} io 
 * @param {Socket} socket 
 */
(io, socket) => {
    // if at /place
    if (socket.handshake.headers.referer.endsWith('8080/')) {
        socket.join('place');

        // get place
        Place.findAll().then(places => {
            socket.emit('places', places);
        });

        socket.emit('cooldown', cooldown);
        socket.emit('colors', colors);
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
            if (data.x < 0 || data.x > 100 || data.y < 0 || data.y > 100) {
                throw new Error('Invalid coordinates.');
            }

            const place = await Place.findOne({
                where: {
                    x: data.x,
                    y: data.y
                }
            });

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
}