const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const accounts = require('./accounts');

const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server);

function render(req, res, file) {
    accounts.getReqAccount(req).then((acc) => {
        res.render(file, {
            account: acc
        });
    });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => { render(req, res, 'index'); });

app.get('/user/login/:id/:token', (req, res) => {
    accounts.setResAccount(res, req.params.id, req.params.token);
    res.redirect('/');
});

app.get('/user/logout', (req, res) => {
    accounts.removeResAccount(res);
    res.redirect('/');
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
    
    if (fs.existsSync(ejsPath)) render(req, res, ejsPath);
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

function chkArgs(...args) {
    if (args.length % 2 != 0) return false;

    for (var i = 0; i < args.length; i+=2) {
        if (typeof args[i] !== args[i + 1]) return false;
    }

    return true;
}

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('login', (data, callback) => {
        if (!chkArgs(data.email, 'string', data.password, 'string')) {
            return callback({
                success: false,
                error: "Invalid arguments."
            });
        }

        accounts.login(data.email, data.password, callback);
    });

    socket.on('register', (data, callback) => {
        if (!chkArgs(data.email, 'string', data.password, 'string')) {
            return callback({
                success: false,
                error: "Invalid arguments."
            });
        }

        accounts.register(data.email, data.password, callback);
    });
});

server.listen(3000, () => {
    console.log('Server on port 3000');
});
