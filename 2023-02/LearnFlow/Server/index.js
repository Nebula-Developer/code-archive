require('dotenv').config();

const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const fs = require('fs');
const args = require('./src/args');
const paths = require('./src/paths');
const returns = require('./src/returns');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello World!');
});

/** @type {socketIO.Server} */
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.addListener('connection', (socket) => {
    socket.on('getFile', (file, callback) => {
        if (!args.checkCallback(callback)) return;
        if (!args.check(file, 'string')) return callback(returns.invalidArguments);

        var filePath = path.resolve(paths.getPublic(file));
        console.log(filePath);
        if (!fs.existsSync(filePath)) return callback(returns.error("File not found"));
        if (fs.statSync(filePath).isDirectory()) return callback(returns.error("Cannot read a directory"));
        if (!filePath.startsWith(paths.public)) return callback(returns.error("Cannot read a file outside of the public folder"));

        return callback(returns.success(fs.readFileSync(filePath, 'utf-8')));
    });
});

require('./src/accounts').socketHandler(io);
require('./src/message').socketHandler(io);

server.listen(process.env.PORT || 3002, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
