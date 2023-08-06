const sqlite3 = require('sqlite3').verbose();
const returns = require('./returns.js');
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

function createChannel(name, owner) {
    return new Promise((resolve, reject) => {
        const insertChannelQuery = `
            INSERT INTO Channels (name, owner)
            VALUES (?, ?)
        `;
        db.run(insertChannelQuery, [name, owner], function(err) {
            if (err) {
                resolve(returns.error('Channel creation failed'));
            } else {
                resolve(returns.success({ id: this.lastID }));
            }
        });
    });
}

function deleteChannel(channelId) {
    return new Promise((resolve, reject) => {
        const deleteChannelQuery = `
            DELETE FROM Channels
            WHERE id = ?
        `;
        db.run(deleteChannelQuery, [channelId], function(err) {
            if (err) {
                resolve(returns.error('Channel deletion failed'));
            } else {
                resolve(returns.success({ message: 'Channel deleted successfully' }));
            }
        });
    });
}

function sendMessage(user_id, channel_id, message) {
    return new Promise((resolve, reject) => {
        const insertMessageQuery = `
            INSERT INTO Messages (message, user_id, channel_id)
            VALUES (?, ?, ?)
        `;
        db.run(insertMessageQuery, [message, user_id, channel_id], function(err) {
            if (err) {
                resolve(returns.error('Sending message failed'));
            } else {
                resolve(returns.success({ id: this.lastID }));
            }
        });
    });
}

function deleteMessage(userId, messageId) {
    return new Promise((resolve, reject) => {
        const deleteMessageQuery = `
            DELETE FROM Messages
            WHERE id = ? AND user_id = ?
        `;
        db.run(deleteMessageQuery, [messageId, userId], function(err) {
            if (err) {
                resolve(returns.error('Message deletion failed'));
            } else if (this.changes === 0) {
                resolve(returns.error('Message not found or you are not the author'));
            } else {
                resolve(returns.success({ message: 'Message deleted successfully' }));
            }
        });
    });
}

function getMessages(id, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
        const getMessagesQuery = `
            SELECT *
            FROM Messages
            WHERE channel_id = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;

        db.all(getMessagesQuery, [id, limit, offset], (err, rows) => {
            if (err) {
                resolve(returns.error('Failed to get messages'));
            } else {
                resolve(returns.success(rows));
            }
        });
    });
}

module.exports = { createChannel, deleteChannel, sendMessage, deleteMessage, getMessages };
