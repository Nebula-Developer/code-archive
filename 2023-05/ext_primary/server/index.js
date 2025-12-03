const socketIO = require('socket.io');
const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(() => { });
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log("Got connection");
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
