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
            author INTEGER NOT NULL,
            date TEXT NOT NULL
        )
    `);
});