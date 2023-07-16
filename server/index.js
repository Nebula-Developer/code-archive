const http = require('http');
const { env } = require('process');
const { Socket, Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server);

require('dotenv').config();
const port = env.PORT || 3000;

/** @param {Socket} socket */
function socketHandler(socket) {
    console.log("Got new socket connection:", socket.id);
}

io.on('connection', socketHandler);

server.listen(port, () => {
    console.log("Server listening on", server.address().address + ":" + server.address().port);
});

