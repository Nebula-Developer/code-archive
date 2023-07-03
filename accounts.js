const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));

const db = new sqlite3.Database(path.join(__dirname, 'db', 'users.db'), (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
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

    console.log(cookies);

    var acc = cookies.split(';').find(c => c.trim().startsWith('account='));
    if (!acc) return null;
    acc = acc.split('=')[1];

    try { acc = JSON.parse(acc); }
    catch (e) { return null; }

    if (!acc.id || !acc.token) return null;

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get('SELECT * FROM users WHERE id = ?', [acc.id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                if (!row) {
                    resolve(null);
                    return;
                }

                var tokens = JSON.parse(row.tokens);

                if (!tokens.includes(acc.token)) {
                    resolve(null);
                    return;
                }

                resolve(row);
            });
        });
    });
}

function setResAccount(res, id, token) {
    var content = JSON.stringify({ id, token });
    var cookie = res.getHeader('Set-Cookie');
    
    if (cookie)
        cookie = cookie.split(';').filter(c => !c.trim().startsWith('account=')).join(';');

    var expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString();
    res.setHeader('Set-Cookie', `${cookie ? cookie + '; ' : ''}` + `account=${content}; HttpOnly; SameSite=Strict; Path=/; Expires=${expires}`);
}

function removeResAccount(res) { res.setHeader('Set-Cookie', 'account=; HttpOnly; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; token=; HttpOnly; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'); }

function genToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function login(email, password, callback) {
    db.serialize(() => {
        db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
            if (err) {
                console.error(err.message);
                callback({
                    success: false,
                    error: "Internal server error."
                });
                return;
            }

            if (!row) {
                callback({
                    success: false,
                    error: "Invalid email or password."
                });
                return;
            }

            var tokens = JSON.parse(row.tokens);
            tokens.push(genToken());
            if (tokens.length > 5) tokens.shift();

            db.run('UPDATE users SET tokens = ? WHERE id = ?', [JSON.stringify(tokens), row.id], (err) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
            });

            callback({
                success: true,
                data: { id: row.id, token: tokens[tokens.length - 1] }
            });
        });
    });
}

function register(email, password, callback) {
    db.serialize(() => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                console.error(err.message);
                callback({
                    success: false,
                    error: "Internal server error."
                });
                return;
            }

            if (row) {
                callback({
                    success: false,
                    error: "Email already registered."
                });
                return;
            }

            var tokens = [genToken()];

            db.run('INSERT INTO users (email, password, tokens) VALUES (?, ?, ?)', [email, password, JSON.stringify(tokens)], function(err) {
                if (err) {
                    console.error(err.message);
                    callback({
                        success: false,
                        error: "Internal server error."
                    });
                    return;
                }

                callback({
                    success: true,
                    data: { id: this.lastID, token: tokens[0] }
                });
            });
        });
    });
}

module.exports = {
    getReqAccount, setResAccount, removeResAccount,
    login, register,
    db
};
