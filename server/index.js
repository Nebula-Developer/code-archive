const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = '8008';
var uptime = 0;
setInterval(() => {
    uptime = Math.round(process.uptime());
}, 1000);

const server = http.createServer((req, res) => {
    res.end(`
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;

                min-height: 100vh;
                min-height: -webkit-fill-available;
            }

            h3 { margin: 0; color: #711cb6; }
        </style>

        <h1 style="color: #572680;">LearnPlus Global Server</h1>
        <h3>Uptime: ${uptime}s</h3>
        <h3>Port: ${port}</h3>
    `);
});

const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['polling']
});

function success(data) {
    return { success: true, data: data }
}

function error(msg) {
    return { success: false, error: msg }
}

io.on('connection', (socket) => {
    socket.on('getFile', (name, callback) => {
        if (fs.existsSync(path.join('public', name))) {
            callback(success(fs.readFileSync(path.join('public', name), 'utf8')));
        } else {
            callback(error('File not found.'));
        }
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
