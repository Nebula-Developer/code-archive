const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function getReqAccount(req) {
    var cookies = req.headers.cookie;
    if (!cookies) return null;
    var cookie = cookies.split(';').find(cookie => cookie.trim().startsWith('account='));
    if (!cookie) return null;
    return cookie.split('=')[1];
}

function setResAccount(res, account) {
    res.setHeader('Set-Cookie', 'account=' + account + '; HttpOnly; SameSite=Strict; Secure');
}

app.get('/', (req, res) => {
    console.log(getReqAccount(req));
    if (getReqAccount(req) === null) setResAccount(res, 'guest');
    res.render('index');
});

// Handle views
app.get('*', (req, res) => {
    var ejsPath = path.join(__dirname, 'views', req.path + '.ejs');
    var normPath = path.join(__dirname, 'public', req.path);
    ejsPath = path.resolve(ejsPath);
    normPath = path.resolve(normPath);

    if (!ejsPath.startsWith(path.join(__dirname, 'views')) || !normPath.startsWith(path.join(__dirname, 'public'))) {
        res.write('403');
        res.end();
        return;
    }
    
    if (fs.existsSync(ejsPath)) {
        res.render(ejsPath);
    } else if (fs.existsSync(normPath)) {
        res.sendFile(normPath);
    } else {
        res.write('404');
        res.end();
    }
});

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server on port 3000');
});
