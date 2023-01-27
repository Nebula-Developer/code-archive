const http = require('http');
const { Server } = require('socket.io');
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

            h3 {
                margin: 0;
                color: #711cb6;
            }
        </style>

        <h1 style="color: #572680;">
            LearnPlus Global Server
        </h1>

        <h3>Uptime: ${uptime}s</h3>
        <h3>Port: ${port}</h3>
    `);
});

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: ['polling']
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.emit('message', 'Server assigned ID: ' + socket.id);
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
