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

const private = path.join(__dirname, 'private');
const users = path.join(private, 'users.json');
const channels = path.join(private, 'channels.json');

if (!fs.existsSync(private)) fs.mkdirSync(private);
if (!fs.existsSync(users)) fs.writeFileSync(users, JSON.stringify([]));
if (!fs.existsSync(channels)) fs.writeFileSync(channels, JSON.stringify([]));
function getUsers() { return JSON.parse(fs.readFileSync(users)); }
function saveUsers(userData) { fs.writeFileSync(users, JSON.stringify(userData, null, 4)); }
function getChannels() { return JSON.parse(fs.readFileSync(channels)); }
function saveChannels(channelData) { fs.writeFileSync(channels, JSON.stringify(channelData, null, 4)); }

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

    socket.on('register', (data, callback) => {
        if (!data.username || !data.email || !data.password) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var users = getUsers();
        var user = users.find(u => u.username.toLowerCase() === data.username.toLowerCase() || u.email.toLowerCase() === data.email.toLowerCase());
        if (user) {
            callback(error('Username or email already exists.'));
            return;
        }

        var salt = crypto.randomBytes(16).toString('hex');
        var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, 'sha512').toString('hex');

        var newToken = crypto.randomBytes(16).toString('hex');

        var newUser = {
            username: data.username,
            email: data.email.toLowerCase(),
            salt: salt,
            hash: hash,
            tokens: [newToken],
            id: crypto.randomBytes(16).toString('hex') + ":" + Date.now()
        };

        users.push(newUser);

        saveUsers(users);
        newUser.token = newToken;

        callback(success(safeUser(newUser)));
        socket.token = newToken;
    });

    socket.on('login', (data, callback) => {
        if (!data.username || !data.password) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var users = getUsers();
        var user = users.find(u => u.username.toLowerCase() === data.username.toLowerCase());
        if (!user) {
            callback(error('Username or password is incorrect.'));
            return;
        }

        var hash = crypto.pbkdf2Sync(data.password, user.salt, 1000, 64, 'sha512').toString('hex');
        if (hash !== user.hash) {
            callback(error('Username or password is incorrect.'));
            return;
        }

        var newToken = crypto.randomBytes(16).toString('hex');
        user.tokens.push(newToken);
        if (user.tokens.length > 5) user.tokens.shift();

        saveUsers(users);
        user.token = newToken;

        callback(success(safeUser(user)));
        socket.token = newToken;
    });

    socket.on('loginToken', (data, callback) => {
        if (!data.token) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var users = getUsers();
        var user = users.find(u => u.tokens.includes(data.token));
        if (!user) {
            callback(error('Invalid token.'));
            return;
        }

        callback(success(safeUser(user)));
        socket.token = data.token;
    });
    
    socket.on('sendMessage', (data, callback) => {
        if (!data.message || !data.channel) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var user = getSocketAccount(socket);
        if (!user) {
            callback(error('Invalid token.'));
            return;
        }

        var channels = getChannels();
        var channel = channels.find(c => c.id === data.channel);
        if (!channel) {
            callback(error('Invalid channel.'));
            return;
        }

        var message = {
            id: crypto.randomBytes(16).toString('hex') + ":" + Date.now(),
            sender: user.id,
            message: data.message,
            timestamp: Date.now()
        };

        channel.messages.push(message);
        saveChannels(channels);
        message.channel = channel.id;
        message.username = user.username;
        io.to(data.channel).emit('message', message);
        callback(success(message));
    });

    socket.on('getMessages', (data, callback) => {
        if (!data.channel) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var user = getSocketAccount(socket);
        if (!user) {
            callback(error('Invalid token.'));
            return;
        }

        var channel = getChannel(data.channel);
        if (!channel) {
            callback(error('Invalid channel.'));
            return;
        }

        var messages = channel.messages.map(m => {
            var user = getUsers().find(u => u.id === m.sender);
            m.username = user.username;
            return m;
        });

        callback(success(messages));
    });

    socket.on('joinChannel', (data, callback) => {
        if (!data.channel) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var user = getSocketAccount(socket);
        if (!user) { callback(error('Invalid token.')); return; }
        var channel = getChannel(data.channel);
        if (!channel) { callback(error('Invalid channel.')); return; }

        socket.join(data.channel);
        var messages = channel.messages.map(m => {
            var user = getUsers().find(u => u.id === m.sender);
            m.username = user.username;
            return m;
        });

        callback(success(messages));
    });

    socket.on('leaveChannel', (data, callback) => {
        if (!data.channel) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var user = getSocketAccount(socket);
        if (!user) { callback(error('Invalid token.')); return; }
        var channel = getChannel(data.channel);
        if (!channel) { callback(error('Invalid channel.')); return; }

        socket.leave(data.channel);
        callback(success());
    });

    socket.on('createChannel', (data, callback) => {
        if (!data.name) {
            callback(error('Please fill in all fields.'));
            return;
        }

        var user = getSocketAccount(socket);
        if (!user) { callback(error('Invalid token.')); return; }

        var channels = getChannels();
        var channel = channels.find(c => c.name.toLowerCase() === data.name.toLowerCase());
        if (channel) { callback(error('Channel already exists.')); return; }

        var newChannel = {
            id: crypto.randomBytes(16).toString('hex') + ":" + Date.now(),
            name: data.name,
            messages: []
        };

        channels.push(newChannel);
        saveChannels(channels);

        callback(success(newChannel));
    });

    socket.on('getChannels', (data, callback) => {
        var user = getSocketAccount(socket);
        if (!user) { callback(error('Invalid token.')); return; }

        var channels = getChannels();
        // Delete the messages from the channels
        channels = channels.map(c => {
            delete c.messages;
            return c;
        });
        callback(success(channels));
    });
});

function safeUser(user) {
    delete user.salt;
    delete user.hash;
    delete user.tokens;
    return user;
}

function getSocketAccount(socket) {
    var users = getUsers();
    var user = users.find(u => u.tokens.includes(socket.token));
    return user;
}

function getChannel(id) {
    var channels = getChannels();
    var channel = channels.find(c => c.id === id);
    return channel;
}

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
