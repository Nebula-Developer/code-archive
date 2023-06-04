const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server);

if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'), (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to database');
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function getReqAccount(req) {
    var cookies = req.headers.cookie;
    if (!cookies) return null;
    var cookie = cookies.split(';').find(cookie => cookie.trim().startsWith('account='));
    if (!cookie) return null;
    return cookie.split('=')[1];
}

function setResAccount(res, account) { res.setHeader('Set-Cookie', 'account=' + account + '; HttpOnly; SameSite=Strict; Secure'); }

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
    
    if (fs.existsSync(ejsPath)) res.render(ejsPath);
    else if (fs.existsSync(normPath)) res.sendFile(normPath);
    else {
        res.write(`
            <div style="padding: 30px">
                <h1 style="font-family: sans-serif; font-size: 50px; font-weight: 300; margin: 0; user-select: none;">404 - Page Not Found<h1>
                <a href="/" style="font-family: sans-serif; font-size: 20px; font-weight: 300; text-decoration: none; margin: 0; user-select: none;">Go Home</a>
            </div>
        `);
        res.end();
    }
});

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('login', (data, callback) => {
        callback({
            success: false,
            error: "Please come back later."
        });
    });

    socket.on('register', (data, callback) => {
        callback({
            success: false,
            error: "Please come back later."
        });
    });
});

server.listen(3000, () => {
    console.log('Server on port 3000');
});
