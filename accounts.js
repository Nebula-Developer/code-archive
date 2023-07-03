const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const util = require('./util');

const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'), (err) => {
    if (util.handleError(err)) return;

    console.log('Connected to users database');

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            tokens TEXT NOT NULL DEFAULT '[]'
        )
    `);
});

async function getReqAccount(req) {
    var cookies = req.headers.cookie;
    if (!cookies) return null;

    var acc = cookies.split(';').find(c => c.trim().startsWith('account='));
    if (!acc) return null;
    acc = acc.split('=')[1];

    try { acc = JSON.parse(acc); }
    catch (e) { return null; }

    if (!acc.id || !acc.token) return null;

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get('SELECT * FROM users WHERE id = ?', [acc.id], (err, row) => {
                if (util.handleError(err) || !row) return resolve(null);

                var tokens = JSON.parse(row.tokens);
                if (!tokens.includes(acc.token)) resolve(null);

                resolve(row);
            });
        });
    });
}

async function getSocketAccount(socket) {
    var cookies = socket.request.headers.cookie;
    if (!cookies) return null;

    var acc = cookies.split(';').find(c => c.trim().startsWith('account='));
    if (!acc) return null;
    acc = acc.split('=')[1];

    try { acc = JSON.parse(acc); }
    catch (e) { return null; }

    if (!acc.id || !acc.token) return null;

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get('SELECT * FROM users WHERE id = ?', [acc.id], (err, row) => {
                if (util.handleError(err) || !row) return resolve(null);

                var tokens = JSON.parse(row.tokens);
                if (!tokens.includes(acc.token)) resolve(null);

                resolve(row);
            });
        });
    });
}

function setResAccount(res, id, token) {
    var content = JSON.stringify({ id, token });
    var cookie = res.getHeader('Set-Cookie');
    
    if (cookie) cookie = cookie
                        .split(';')
                        .filter(c => !c.trim().startsWith('account='))
                        .join(';');

    var expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString();
    res.setHeader('Set-Cookie', `${cookie ? cookie + '; ' : ''}` + `account=${content}; HttpOnly; SameSite=Strict; Path=/; Expires=${expires}`);
}

function removeResAccount(res) {
    var expires = "Thu, 01 Jan 1970 00:00:00 GMT";
    res.setHeader('Set-Cookie', `account=; HttpOnly; SameSite=Strict; Path=/; Expires=${expires}`);
}

function genToken() {
    var randA = Math.random().toString(36).substring(2, 15),
        randB = Math.random().toString(36).substring(2, 15);
    return randA + randB + Date.now().toString(36);
}

const internalError = util.error("Internal server error.");

function login(email, password, callback) {
    db.serialize(() => {
        db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
            if (util.handleError(err)) return callback(internalError);

            if (!row) return callback(util.error("Invalid email or password."));

            var tokens = JSON.parse(row.tokens);
            tokens.push(genToken());
            if (tokens.length > 5) tokens.shift();

            db.run('UPDATE users SET tokens = ? WHERE id = ?', [JSON.stringify(tokens), row.id], (err) => {
                if (util.handleError(err)) return callback(internalError);
                callback(util.success({ id: row.id, token: tokens[tokens.length - 1] }));
            });
        });
    });
}

function register(email, password, callback) {
    db.serialize(() => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (util.handleError(err)) return callback(internalError);

            if (row) return callback(util.error("Email already in use."));

            var tokens = [ genToken() ];

            db.run('INSERT INTO users (email, password, tokens) VALUES (?, ?, ?)', [email, password, JSON.stringify(tokens)], function(err) {
                if (util.handleError(err)) return callback(internalError);
                callback(util.success({ id: this.lastID, token: tokens[0] }));
            });
        });
    });
}

module.exports = {
    setResAccount, removeResAccount,
    getReqAccount, getSocketAccount,
    login, register,
    db
};
