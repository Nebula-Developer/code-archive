const socketIO = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const paths = require('./paths');
const returns = require('./returns');
const args = require('./args');

const accountsDBPath = paths.getPrivate('accounts.db');
if (!fs.existsSync(accountsDBPath)) fs.writeFileSync(accountsDBPath, '');
const accountsDB = new sqlite3.Database(accountsDBPath, (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the accounts database.');
});

class User {
    /** @type {number} */
    id;
    /** @type {string} */
    username;
    /** @type {string} */
    password;
    /** @type {string} */
    email;
    /** @type {Array} */
    tokens;

    /**
     * Creates a new user object.
     * @param {number} id
     * @param {string} username
     * @param {string} password
     * @param {string} email
     * @param {Array} tokens
     */
    constructor(id, username, password, email, tokens) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.tokens = tokens;
    }
}

/**
 * Make sure a user has all the required fields.
 * @param {Object} user
 * @returns {Boolean}
 */
function checkUser(user) {
    if (!args.check(user, 'object')) return false;
    return args.check(user.id, 'number', user.username, 'string', user.password, 'string', user.email, 'string', user.tokens, 'object');
}

function createUserTable() {
    return new Promise((resolve, reject) => {
        accountsDB.serialize(() => {
            // The username and email fields are unique.
            accountsDB.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL, tokens TEXT NOT NULL, UNIQUE(email), UNIQUE(username))', (err) => {
                resolve();
            });
        });
    });
}

function considerCreatingUserTable() {
    return new Promise((resolve, reject) => {
        accountsDB.serialize(() => {
            accountsDB.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'users\'', (err, row) => {
                if (!row) createUserTable();
                resolve();
            });
        });
    });
}

/**
 * Shove a token into the user's token array, and make sure there are < 5 tokens.
 * @param {number} id 
 */
function shoveToken(id) {
    return new Promise((resolve, reject) => {
        accountsDB.serialize(() => {
            accountsDB.get('SELECT * FROM users WHERE id=?', [id], (err, row) => {
                if (err) reject(err);
                if (!row) reject(returns.userNotFound);
                var tokens = JSON.parse(row.tokens);
                var tokenToAdd = Date.now().toString() + "-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                tokens.push(tokenToAdd);
                if (tokens.length > 5) tokens.shift();
                accountsDB.run('UPDATE users SET tokens=? WHERE id=?', [JSON.stringify(tokens), id], (err) => {
                    if (err) reject(err);
                    resolve(tokenToAdd);
                });
            });
        });
    });
}

function insertUser(data) {
    if (!args.check(data.username, 'string', data.password, 'string', data.email, 'string')) return returns.invalidArguments;
    return new Promise((resolve, reject) => {
        accountsDB.serialize(() => {
            accountsDB.run('INSERT INTO users (username, password, email, tokens) VALUES (?, ?, ?, ?)', [data.username, data.password, data.email, JSON.stringify([])], (err) => {
                if (err) reject(err);
                
                accountsDB.get('SELECT * FROM users WHERE username=?', [data.username], (err, row) => {
                    if (err) reject(err);
                    if (!row) reject(returns.userNotFound);
                    shoveToken(row.id).then((token) => {
                        resolve({ id: row.id, username: row.username, email: row.email, token: token });
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });
        });
    });
}

/**
 * Get a user based on the input data.
 * @param {User} data
 * @returns {User}
 * @example getUser({ id: 0 }, (user) => { });
 */
function getUser(data) {
    return new Promise((resolve, reject) => {
        var where = '';
        var whereArgs = [];

        for (var i = 0; i < Object.keys(data).length; i++) {
            var key = Object.keys(data)[i];
            var value = data[key];
            if (i != 0 && i != Object.keys(data).length - 1) where += ' AND ';
            where += key + '=?';
            whereArgs.push(value);
        }

        accountsDB.serialize(() => {
            accountsDB.get('SELECT * FROM users WHERE ' + where, whereArgs, (err, row) => {
                if (err) reject(err);
                if (!row) { reject(returns.userNotFound); return; }
                
                row.tokens = JSON.parse(row.tokens);
                
                if (!checkUser(row)) {
                    reject(returns.userNotFound);
                    return;
                }
                resolve(new User(row.id, row.username, row.password, row.email, row.tokens));
            });
        });
    });
}

/**
 * Get user who has a specific token.
 * @param {string} token
 * @returns {User}
 */
function getUserByToken(token) {
    return new Promise((resolve, reject) => {
        accountsDB.serialize(() => {
            accountsDB.all('SELECT * FROM users', (err, rows) => {
                if (err) { reject(err); return; }
                if (!rows) { reject(returns.userNotFound); return; }

                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    row.tokens = JSON.parse(row.tokens);
                    if (row.tokens.includes(token)) {
                        console.log("Found token match for user: " + row.username);
                        resolve(new User(row.id, row.username, row.password, row.email, row.tokens));
                        return;
                    }
                }
            });
        });
    });
}

/**
 * @param {socketIO.Server} io
 */
async function socketHandler(io) {
    await considerCreatingUserTable();

    io.addListener('connection', (socket) => {
        socket.on('register', (data, callback) => {
            if (!args.checkCallback(callback)) return;
            
            if (!args.check(data.username, 'string', data.password, 'string', data.email, 'string')) return callback(returns.invalidArguments);
            getUser({ username: data.username }).then((res) => { callback(returns.accountExists) }).catch(args.empty);
            getUser({ email: data.email }).then((res) => { callback(returns.accountExists) }).catch(args.empty);
            insertUser(data).then((res) => {
                callback(returns.success(res));
            }).catch((err) => {
                callback(returns.error(err));
            });
        });

        socket.on('login', (data, callback) => {
            if (!args.checkCallback(callback)) return;

            if (!args.check(data.username, 'string', data.password, 'string')) return callback(returns.invalidArguments);
            getUser({ username: data.username }).then((user) => {
                if (user.password != data.password) return callback(returns.invalidPassword);
                shoveToken(user.id).then((token) => {
                    callback(returns.success({ username: user.username, email: user.email, token: token }));
                }).catch((err) => {
                    callback(returns.error(err));
                });
            }).catch((err) => {
                callback(returns.error(err));
            });
        });

        socket.on('login_token', (data, callback) => {
            if (!args.checkCallback(callback)) return;
            if (!args.check(data.token, 'string')) return callback(returns.invalidArguments);

            getUserByToken(data.token).then((user) => {
                shoveToken(user.id).then((token) => {
                    callback(returns.success({ username: user.username, email: user.email, token: token }));
                }).catch((err) => {
                    callback(returns.error(err));
                });
            }).catch((err) => {
                callback(returns.error(err));
            });
        });
    });
}

module.exports = {
    socketHandler,
    getUser,
    getUserByToken,
    insertUser,
    shoveToken
}
