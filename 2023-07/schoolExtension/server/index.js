const http = require('http');
const { incomingMessage, ServerResponse } = require('http');
const { env } = require('process');
const { Socket, Server } = require('socket.io');
const { success, error } = require('./response');

const server = http.createServer(requestHandler);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: [
        'polling',
        'websocket'
    ]
});

require('dotenv').config();
const port = env.PORT || 3000;

/**
 * @param {incomingMessage} req
 * @param {ServerResponse} res
 */
function requestHandler(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}

/** @param {Socket} socket */
function socketHandler(socket) {
    console.log("Got new socket connection:", socket.id);

}

io.on('connection', socketHandler);

server.listen(port, () => {
    console.log("Server listening on", server.address().address + ":" + server.address().port);
});

