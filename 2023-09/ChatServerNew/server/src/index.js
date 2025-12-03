const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const winston = require('winston');

const returns = require('./returns');
const { Database } = require('./db');
const tests = require('./tests');
const logger = require('./logger');

const socketLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
            const timestamp = new Date(info.timestamp);
            const iso8601 = timestamp.toISOString();
            const formattedTimestamp = iso8601.slice(0, 19).replace("T", " ");
            return `[${formattedTimestamp}] [${info.level.toUpperCase()}]: ${info.message}`;
        }),
        winston.format.colorize({ all: true })
    ),
    transports: [
        new winston.transports.File({ filename: 'temp/SocketLog.log' }),
        new winston.transports.Console()
    ],
    exitOnError: false
});

const db = new Database('main');
db.createTables();

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: '*'
    },
    transports: ['websocket', 'polling']
});

function checkArgs(...args) {
    if (args.length % 2 != 0) throw new Error('Invalid number of arguments');

    for (var i = 0; i < args.length; i += 2) {
        if (args[i] && typeof args[i] != args[i + 1]) return false;
    }

    return true;
}

const checkCallback = (callback) => callback && typeof callback == 'function';

io.on('connection', (socket) => {
    socketLogger.info('User connected: ' +socket.id);

    socket.on('disconnect', () => {
        socketLogger.info('User disconnected: ' + socket.id);
    });

    var methods = [
        /* "createUser", "createChat", "createMessage", */
        "getUserSafe", "getChat", "getMessage",
        "getChats",
        "getUsersFromSafe", "getChatsFrom", "getMessagesFrom", "getMessages",
        "searchUsersSafe", "searchChats", "searchMessages",
        /* "updateUser", "updateChat", "updateMessage", */
        /* "getUserByPassword", "getUserByToken", */
        /* "deleteUser", "deleteChat", "deleteMessage", */
    ];

    methods.forEach((method) => {
        socket.on(method, async (...args) => {
            if (!checkCallback(args[args.length - 1])) return;
            var callback = args[args.length - 1];

            var realArgs = args.slice(0, args.length - 1);

            try {
                var result = await db[method](...realArgs);
                socketLogger.info(`Successfully ran ${method}`);
                callback(returns.success(result));
            } catch (err) {
                socketLogger.error(`Error running ${method}:`, err);
                callback(returns.error(err));
            }
        });
    });

    socket.on('createUser', async (username, password, email, callback) => {
        if (!checkCallback(callback)) return;
        if (!checkArgs(username, 'string', password, 'string', email, 'string')) return callback(returns.error('Invalid arguments'));

        try {
            var result = await db.createUser(username, password, email);
            socketLogger.info(`Successfully created user ${username}`);
            socket.user = result;
            callback(returns.success(result));
        } catch (err) {
            socketLogger.error(`Error creating user ${username}: ` + err);
            callback(returns.error(err));
        }
    });

    socket.on('createChat', async (name, callback) => {
        if (!checkCallback(callback)) return;
        if (!checkArgs(name, 'string')) return callback(returns.error('Invalid arguments'));
        if (!socket.user) return callback(returns.error('Not logged in'));

        try {
            var result = await db.createChat(name, socket.user.id);
            socketLogger.info(`Successfully created chat ${name}`);
            callback(returns.success(result));
        } catch (err) {
            socketLogger.error(`Error creating chat ${name}: ` + err);
            callback(returns.error(err));
        }
    });

    socket.on('createMessage', async (chat, content, callback) => {
        var timer = new Date().getTime();
        if (!checkCallback(callback)) return;
        if (!checkArgs(chat, 'number', content, 'string')) return callback(returns.error('Invalid arguments'));
        if (!socket.user) return callback(returns.error('Not logged in'));

        console.log("Timer A: " + (new Date().getTime() - timer) + "ms");

        try {
            timer = new Date().getTime();
            var result = await db.createMessage(content, socket.user.id, chat);
            console.log("Timer B: " + (new Date().getTime() - timer) + "ms");
            socketLogger.info(`Successfully created message '${content}'`);
            io.to("chat-" + chat).emit('message', result);
            callback(returns.success(result));
        } catch (err) {
            socketLogger.error(`Error creating message '${content}': ` + err);
            callback(returns.error(err));
        }
    });

    socket.on('loginPassword', async (email, password, callback) => {
        if (!checkCallback(callback)) return;
        if (!checkArgs(email, 'string', password, 'string')) return callback(returns.error('Invalid arguments'));

        try {
            var result = await db.getUserByPassword(email, password);
            if (!result) return callback(returns.error('Invalid email or password'));
            socketLogger.info(`Successfully logged in with password`);
            socket.user = result;
            callback(returns.success(result));
        } catch (err) {
            socketLogger.error(`Error logging in with password: ` + err);
            callback(returns.error(err));
        }
    });

    socket.on('loginToken', async (token, callback) => {
        if (!checkCallback(callback)) return;
        if (!checkArgs(token, 'string')) return callback(returns.error('Invalid arguments'));

        try {
            var result = await db.getUserByToken(token);
            if (!result) return callback(returns.error('Invalid token'));
            socketLogger.info(`Successfully logged in with token`);
            socket.user = result;
            callback(returns.success(result));
        } catch (err) {
            socketLogger.error(`Error logging in with token: ` + err);
            callback(returns.error(err));
        }
    });

    socket.on('joinChat', (chatID, callback) => {
        db.getChat(chatID).then((chat) => {
            if (!chat) return callback(returns.error('Invalid chat ID'));

            socket.join("chat-" + chatID);
            socketLogger.info(`Socket ${socket.id} joined chat-${chatID}`);
            callback(returns.success(chat));
        }).catch((err) => {
            socketLogger.error(`Error joining chat-${chatID}: ` + err);
            callback(returns.error(err));
        });
    });

    socket.on('leaveChat', (chatID, callback) => {
        socket.leave("chat-" + chatID);
        socketLogger.info(`Socket ${socket.id} left chat-${chatID}`);
        callback(returns.success());
    });
});

server.listen(3000, () => {
    logger.info('Listening on *:3000');
});
