const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = new socketIO.Server(server, {
    cors: {
        origin: '*',
        allowedHeaders: '*',
        methods: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const fullCorsAccess = (req, res, next) => {
    // Disable same-origin policy
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', '*');
    res.append('Access-Control-Allow-Headers', '*');
    res.append('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};

app.use(fullCorsAccess);

app.use(express.static(path.join(__dirname, '../Files')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Files/learnsharp.js'));
});

app.get('/jquery', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/jquery/dist/jquery.min.js'));
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});

io.on('connection', function(socket) {
    socket.on('message', function(message) {
        console.log(message);
    });

    console.log('A user connected');
});