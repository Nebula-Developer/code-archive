const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const returns = require('./src/returns');
const fs = require('fs');

const port = 3002;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("Got connection");

    socket.on('get', (p, callback) => {
        if (!callback || typeof callback !== 'function') return;
        if (!p || typeof p !== 'string') return callback(returns.error("Invalid path."));
        const relativePath = path.resolve(path.join(__dirname, 'public', p));
        if (!relativePath.startsWith(path.resolve(__dirname, 'public'))) return callback(returns.error("Invalid path."));
        if (!fs.existsSync(relativePath)) return callback(returns.error("File does not exist."));
        if (fs.statSync(relativePath).isDirectory()) return callback(returns.error("Cannot get directory."));

        const data = fs.readFileSync(relativePath, 'utf8');
        callback(returns.success(data));
    });

    socket.on('list', (p, callback) => {
        if (!callback || typeof callback !== 'function') return;
        if (!p || typeof p !== 'string') return callback(returns.error("Invalid path."));
        const relativePath = path.resolve(path.join(__dirname, 'public', p));
        if (!relativePath.startsWith(path.resolve(__dirname, 'public'))) return callback(returns.error("Invalid path."));
        if (!fs.existsSync(relativePath)) return callback(returns.error("File does not exist."));
        if (fs.statSync(relativePath).isFile()) return callback(returns.error("Cannot list file."));

        const files = fs.readdirSync(relativePath);
        callback(returns.success(files));
    });
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
