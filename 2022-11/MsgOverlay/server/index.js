const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

function safeUser(user) {
    delete user.password;
    return user;
}

io.on('connection', (socket) => {
    console.log('New client connected');
    sendMsg(socket);

    socket.on('register', (acc, callback) => {
        var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));

        if (!data.accounts) {
            data.accounts = [];
        }

        if (!acc.username || !acc.password || !acc.email) {
            callback({
                success: false,
                error: "Missing fields"
            });
            return;
        }

        var account = data.accounts.find(a => a.email.toLowerCase() == acc.email.toLowerCase());

        if (account) {
            callback({
                success: false,
                error: "Account already exists"
            });
            return;
        }

        var newUser = {
            email: acc.email.toLowerCase(),
            password: acc.password,
            username: acc.username,
            token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            color: generateBrightColor()
        }

        data.accounts.push(newUser);

        fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
        callback({
            success: true,
            account: safeUser(newUser)
        });
    });

    socket.on('login', (acc, callback) => {
        var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));

        if (!data.accounts) {
            data.accounts = [];
        }

        var account = data.accounts.find(a => a.email.toLowerCase() == acc.email.toLowerCase() && a.password == acc.password);

        if (!account) {
            callback({
                success: false,
                error: "Invalid credentials"
            });
            return;
        }

        callback({
            success: true,
            account: safeUser(account)
        });
    });

    socket.on('trylogin', (token) => {
        var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));

        var account = data.accounts.find(a => a.token == token);

        if (!account) {
            return;
        }
        else {
            socket.emit('login', safeUser(account));
        }
    });

    socket.on('message', (dat) => {
        var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));

        if (!data.messages) {
            data.messages = [];
        }

        if (!dat.token)
            return;

        var account = data.accounts.find(a => a.token == dat.token);

        if (!account)
            return;

        var newMsg = {
            from: account.id,
            text: dat.text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            date: new Date()
        };

        if (dat.reply) {
            var msg = data.messages.find(m => m.id == dat.reply);
            if (msg) {
                newMsg.reply = msg.id;
            }
        }

        data.messages.push(newMsg);

        fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
        
        var messages = getFormatMessages();

        io.emit('message', messages[messages.length - 1]);
    });

    socket.on('requestMessages', () => {
        var messages = getFormatMessages();
        socket.emit('messages', messages);
    });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
    console.log('Server started on port 3000');
});

function sendMsg(socket) {
    socket.emit('messages', getFormatMessages());
}

function sendMessages() {
    io.emit('messages', getFormatMessages());
}

function getFormatMessages() {
    var messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')).messages;

    //Set usernames
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

    messages.forEach(m => {
        m = formatMsg(m);
    });

    return messages;
}

function formatMsg(msg) {
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

    var account = data.accounts.find(a => a.id == msg.from);
    msg.username = account.username;

    if (account.color) {
        msg.color = account.color;
    }

    if (msg.reply) {
        var replyMsg = data.messages.find(s => s.id == msg.reply);
        if (replyMsg) {
            msg.reply = {
                username: data.accounts.find(a => a.id == replyMsg.from).username,
                text: replyMsg.text,
                id: replyMsg.id
            }
        }
    }

    return msg;
}

function generateBrightColor() {
    // Color that has rgb values between 150 and 255 and are somewhat close to each other
    var r = Math.floor(Math.random() * 105) + 150;
    var g = Math.floor(Math.random() * 105) + 150;
    var b = Math.floor(Math.random() * 105) + 150;

    // format to hex
    var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    
    return color;
}