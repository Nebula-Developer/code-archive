const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ramMB = 50;

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home/index.html'));
});

app.get('/ok', (req, res) => {
    res.send('OK');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public/error/404/index.html'));
        return;
    }
});

app.get('/status', (req, res) => {
    var statusHTML = fs.readFileSync(path.join(__dirname, 'private/pages/status.html'), 'utf8');
    statusHTML = statusHTML.replaceAll('{PORT}', PORT);
    statusHTML = statusHTML.replaceAll('{UPTIME}', secondsToTimeString(Math.round(process.uptime())) + " (measured " + new Date(Date.now()).toLocaleString() + ")");

    var ramUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    ramUsage = roundTo(ramUsage, 2);

    statusHTML = statusHTML.replaceAll('{MEM_USAGE}', ramUsage); // in MB
    statusHTML = statusHTML.replaceAll('{MEM_PERCENT}', roundTo(ramUsage / ramMB * 100, 2));

    var cpuUsage = process.cpuUsage().user / 1024 / 1024;
    cpuUsage = roundTo(cpuUsage, 2);

    statusHTML = statusHTML.replaceAll('{CPU_USAGE}', cpuUsage); // in MB
    statusHTML = statusHTML.replaceAll('{CPU_PERCENT}', roundTo(cpuUsage / ramMB * 100, 2));
    res.send(statusHTML);
});

function roundTo(num, places) {
    return +(Math.round(num + "e+" + places)  + "e-" + places);
}

function secondsToTimeString(seconds) {
    var days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    var hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    var mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;

    return (days > 0 ? days + " day" + (days > 1 ? "s" : "") + ", " : "") + (hrs > 0 ? hrs + " hour" + (hrs > 1 ? "s" : "") + ", " : "") + (mnts > 0 ? mnts + " minute" + (mnts > 1 ? "s" : "") + ", " : "") + seconds + " second" + (seconds > 1 || seconds == 0 ? "s" : "");
}
