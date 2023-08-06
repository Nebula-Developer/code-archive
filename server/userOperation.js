const sqlite3 = require('sqlite3').verbose();
const returns = require('./returns.js');
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

const genToken = () => { return Math.random().toString(36).substr(2); };

function registerUser(username, email, password) {
    return new Promise((resolve, reject) => {
        const insertUserQuery = `
            INSERT INTO Users (email, password, username, token)
            VALUES (?, ?, ?, ?)
        `;

        var token = genToken();

        db.run(insertUserQuery, [email, password, username, token], function(err) {
            if (err) {
                resolve(returns.error('User registration failed'));
            } else {
                resolve(returns.success({
                    id: this.lastID,
                    token: token
                }));
            }
        });
    });
}

function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        const getUserQuery = `
            SELECT id, token, username, email
            FROM Users
            WHERE email = ? AND password = ?
        `;
        db.get(getUserQuery, [email, password], (err, row) => {
            if (err || !row) {
                resolve(returns.error('Login failed'));
            } else {
                // set token
                var token = genToken();
                const setTokenQuery = `
                    UPDATE Users
                    SET token = ?
                    WHERE id = ?
                `;
                db.run(setTokenQuery, [token, row.id], (err) => {
                    if (err) {
                        resolve(returns.error('Login failed'));
                    } else {
                        resolve(returns.success({
                            id: row.id,
                            token: token,
                            username: row.username,
                            email: row.email
                        }));
                    }
                });
            }
        });
    });
}

function tokenLoginUser(id, token) {
    return new Promise((resolve, reject) => {
        const verifyTokenQuery = `
            SELECT id, username, email
            FROM Users
            WHERE id = ? AND token = ?
        `;
        db.get(verifyTokenQuery, [id, token], (err, row) => {
            if (err || !row) {
                resolve(returns.error('Token login failed'));
            } else {
                resolve(returns.success({
                    id: row.id,
                    username: row.username,
                    email: row.email
                }));
            }
        });
    });
}

module.exports = { registerUser, loginUser, tokenLoginUser };
