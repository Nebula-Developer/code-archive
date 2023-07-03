const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));

const db = new sqlite3.Database(path.join(__dirname, 'db', 'posts.db'), (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to post database');
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            group_id INTEGER NOT NULL,
            author INTEGER NOT NULL,
            date TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);
});

function createGroup(name) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('INSERT INTO groups (name) VALUES (?)', [name], (err) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                resolve(true);
            });
        });
    });
}

function getGroups() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all('SELECT * FROM groups', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                resolve(rows);
            });
        });
    });
}

function createPost(title, content, group_id, author) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('INSERT INTO posts (title, content, group_id, author, date) VALUES (?, ?, ?, ?, ?)', [title, content, group_id, author, new Date().toISOString()], (err) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                resolve(true);
            });
        });
    });
}

function getPosts() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all('SELECT * FROM posts', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                resolve(rows);
            });
        });
    });
}

function getPostsByGroup(group_id) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all('SELECT * FROM posts WHERE group_id = ?', [group_id], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                resolve(rows);
            });
        });
    });
}

function getPost(id) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    resolve(null);
                    return;
                }

                resolve(row);
            });
        });
    });
}

module.exports = {
    createGroup,
    getGroups,
    createPost,
    getPosts,
    getPostsByGroup,
    getPost
};
