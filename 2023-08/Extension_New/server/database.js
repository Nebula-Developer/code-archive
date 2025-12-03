const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const returns = require('./returns');

const dbPath = path.resolve(__dirname, 'db.sqlite');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the database.');
});

db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    token TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS Channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    owner INTEGER NOT NULL,
    FOREIGN KEY(owner) REFERENCES Users(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS Messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(channel_id) REFERENCES Channels(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS UserChannels (
    user_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, channel_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (channel_id) REFERENCES Channels(id)
)`);

module.exports = db;
