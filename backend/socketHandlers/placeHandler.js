const Place = require('../models/Place');
const { Socket, Server } = require('socket.io');

module.exports =

/**
 * @param {Server} io 
 * @param {Socket} socket 
 */
(io, socket) => {
    socket.on('place', async (data, callback) => {
        console.log(socket.request.session);
        if (!socket.request.session.user) {
            callback('You must be logged in to place a pixel');
            return;
        }

        try {
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
            io.emit('place', data);

            callback();
        } catch (error) {
            callback(error);
        }
    });
}