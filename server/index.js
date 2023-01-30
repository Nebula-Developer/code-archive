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
const accounts = path.join(private, 'accounts.json');
const channels = path.join(private, 'channels.json');

function getAccounts() {
    if (!fs.existsSync(accounts)) { fs.writeFileSync(accounts, JSON.stringify([])); }
    return JSON.parse(fs.readFileSync(accounts, 'utf8'));
}

function writeAccounts(data) {
    fs.writeFileSync(accounts, JSON.stringify(data, null, 4));
}

function getChannels() {
    if (!fs.existsSync(channels)) { fs.writeFileSync(channels, JSON.stringify([])); }
    return JSON.parse(fs.readFileSync(channels, 'utf8'));
}

function writeChannels(data) {
    fs.writeFileSync(channels, JSON.stringify(data, null, 4));
}

function getAccountFromID(id) { return getAccounts().find((a) => a.id == id); }
function getAccountFromUsernameEmail(username) { return getAccounts().find((a) => a.username == username || a.email == username); }
function getAccountFromEmail(email) { return getAccounts().find((a) => a.email == email); }
function getAccountFromToken(token) { return getAccounts().find((a) => a.tokens.includes(token)); }
function getChannelFromID(id) { return getChannels().find((c) => c.id == id); }
function getChannelFromName(name) { return getChannels().find((c) => c.name == name); }

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

function success(data) {
    return {
        success: true,
        data: data
    }
}

function error(msg) {
    return {
        success: false,
        error: msg
    }
}

io.on('connection', (socket) => {
    socket.on('getFile', (name, callback) => {
        if (fs.existsSync(path.join('public', name))) {
            callback(success(fs.readFileSync(path.join('public', name), 'utf8')));
        } else {
            callback(error('File not found.'));
        }
    });

    socket.emit('message', 'Server assigned ID: ' + socket.id);

    socket.on('register', (data, callback) => {
        if (!data.username || !data.password || !data.email) {
            callback(error('Invalid data.'));
            return;
        }

        var accounts = getAccounts();

        if (accounts.find((account) => account.username == data.username)) {
            callback(error('Username already taken.'));
            return;
        } else if (accounts.find((account) => account.email == data.email)) {
            callback(error('Email already taken.'));
            return;
        }

        var token = generateToken();

        var newAccount = {
            username: data.username,
            password: data.password,
            email: data.email,
            id: generateID(),
            tokens: [token]
        };

        accounts.push(newAccount);
        writeAccounts(accounts);
        account.token = token;

        callback(success(safeAccount(newAccount)));
    });

    socket.on('login', (data, callback) => {
        if (!data.username || !data.password) {
            callback(error('Invalid data.'));
            return;
        }

        var account = getAccountFromUsernameEmail(data.username);

        if (!account) {
            callback(error('Invalid username.'));
            return;
        }

        if (account.password != data.password) {
            callback(error('Invalid password.'));
            return;
        }

        var newToken = generateToken();
        account.tokens.push(newToken);
        if (account.tokens.length > 5) { account.tokens.shift(); }
        var accounts = getAccounts();
        accounts[accounts.findIndex((a) => a.id == account.id)] = account;
        writeAccounts(accounts);
        account.token = newToken;

        callback(success(safeAccount(account)));
    });

    socket.on('loginToken', (token, callback) => {
        if (!token || typeof token != 'string') {
            callback(error('Invalid data.'));
            return;
        }

        var account = getAccountFromToken(token);

        if (!account) {
            callback(error('Invalid token.'));
            return;
        }

        callback(success(safeAccount(account)));
    });
});

function generateID() {
    return crypto.randomBytes(16).toString('hex');
}

function generateToken() {
    return 'learnplus-' + crypto.randomBytes(32).toString('hex') + ':' + crypto.randomBytes(32).toString('hex');
}

function safeAccount(account) {
    delete account.password;
    delete account.tokens;
    return account;
}

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
