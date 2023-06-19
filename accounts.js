const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

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

async function getReqAccount(req) {
    var cookies = req.headers.cookie;
    if (!cookies) return null;
    var cookie = cookies.split(';').find(cookie => cookie.trim().startsWith('account='));
    if (!cookie) return null;
    var id = cookie.split('=')[1];

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                if (!row) {
                    resolve(null);
                    return;
                }

                resolve(row);
            });
        });
    });
}

function setResAccount(res, account) { res.setHeader('Set-Cookie', 'account=' + account + '; HttpOnly; SameSite=Strict; Path=/'); } 

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

            callback({
                success: true,
                data: { id: row.id }
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

            db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(err) {
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
                    data: { id: this.lastID }
                });
            });
        });
    });
}


module.exports = {
    getReqAccount,
    setResAccount,
    db,
    login, register
};
