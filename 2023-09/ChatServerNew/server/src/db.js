const sqlite3 = require('sqlite3').verbose();
const sqliteDatabase = require('sqlite3').Database;
const fs = require('fs');
const fuzzy = require('fuzzy');
const logger = require('./logger');

if (!fs.existsSync('./db')) fs.mkdirSync('./db');

class Database {
    constructor(name) {
        this.name = name;
        this.db = new sqlite3.Database(`./db/${name}.db`);
    }

    /** @type {sqliteDatabase} */
    db;
    
    tables = [
        `users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            token TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            owner INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(owner) REFERENCES users(id)
        )`,
        `messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            author INTEGER NOT NULL,
            chat INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(author) REFERENCES users(id),
            FOREIGN KEY(chat) REFERENCES chats(id)
        )`
    ];
    
    createTables() {
        return new Promise((resolve, reject) => {
            var tableStartTime = Date.now();
        
            Promise.all(
                this.tables.map((table) => {
                    return new Promise((resolve, reject) => {
                        this.db.run(`CREATE TABLE IF NOT EXISTS ${table}`, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                })
            ).then(() => {
                logger.info("Successfully made tables for database '" + this.name + "' in " + (Date.now() - tableStartTime) + "ms");
                resolve();
            }).catch((err) => {
                logger.info("Error making tables:", err);
                reject(err);
            });
        });
    }
    
    generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    timeNow = () => new Date().toISOString();
    
    // #region Main Methods
    insertData(table, data) {
        return new Promise((resolve, reject) => {
            var keys = Object.keys(data);
            var values = Object.values(data);

            var db = this.db;
    
            this.db.run(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`, values, function(err) {
                if (err) reject(err);
                else {
                    db.get(`SELECT * FROM ${table} WHERE id = ?`, this.lastID, (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }
    
    getData(table, id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM ${table} WHERE id = ?`, id, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
    
    getAllData(table) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getAllDataWhere(table, where, values) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${table} WHERE ${where}`, values, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async getTotalRowsInTable(table, where = null, values = null) {
        return new Promise(async (resolve, reject) => {
            try {
                var rows = await new Promise((resolve, reject) => {
                    this.db.get(`SELECT COUNT(*) AS count FROM ${table} ${where ? 'WHERE ' + where : ''}`, values ? values : [ ], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

                resolve(rows.count);
            } catch (err) {
                reject(err);
            }
        });
    }
    
    async calculateFromDistance(start, limit, table, where = null, values = null) {
        try {
            const totalRows = await this.getTotalRowsInTable(table, where, values);
    
            start = totalRows - limit;
            start = start < 0 ? 0 : start;
            
            return [start, limit];
        } catch (err) {
            throw err;
        }
    }
    
    getAllDataFrom(table, start, limit) {
        return new Promise(async (resolve, reject) => {
            var [newStart, newLimit] = await this.calculateFromDistance(start, limit, table);

            this.db.all(`SELECT * FROM ${table} LIMIT ${newStart}, ${newLimit}`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getAllDataFromWhere(table, start, limit, where, values) {
        return new Promise(async (resolve, reject) => {
            var [newStart, newLimit] = await this.calculateFromDistance(start, limit, table, where, values);

            this.db.all(`SELECT * FROM ${table} WHERE ${where} LIMIT ${newStart}, ${newLimit}`, values, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    
    searchData(table, data) {
        return new Promise((resolve, reject) => {
            var keys = Object.keys(data);
            var values = Object.values(data);

            this.getAllData(table).then((rows) => {
                var results = fuzzy.filter(values.join(' '), rows, {
                    extract: (row) => {
                        return keys.map((key) => row[key]).join(' ');
                    }
                });
    
                resolve(results.map((result) => result.original));
            });
        });
    }
    
    updateData(table, id, data) {
        return new Promise((resolve, reject) => {
            var keys = Object.keys(data);
            var values = Object.values(data);
    
            this.db.run(`UPDATE ${table} SET ${keys.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`, [...values, id], (err) => {
                if (err) reject(err);
                else {
                    this.db.get(`SELECT * FROM ${table} WHERE id = ?`, id, (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }
    
    deleteData(table, id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ${table} WHERE id = ?`, id, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    // This function will convert the foreign keys into their respective objects
    // It takes in either an object, or an array.
    handleMessages(messages) {
        return new Promise((resolve, reject) => {
            if (Array.isArray(messages)) {
                Promise.all(messages.map((message) => {
                    return this.handleMessages(message);
                })).then((messages) => {
                    resolve(messages);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                this.getUserSafe(messages.author).then((author) => {
                    messages.author = author;
                    
                    this.getChat(messages.chat).then((chat) => {
                        messages.chat = chat;
                        
                        resolve(messages);
                    });
                });
            }
        });
    }

    // Same, but for chat owners
    handleChats(chats) {
        return new Promise((resolve, reject) => {
            if (Array.isArray(chats)) {
                Promise.all(chats.map((chat) => {
                    return this.handleChats(chat);
                })).then((chats) => {
                    resolve(chats);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                this.getUserSafe(chats.owner).then((owner) => {
                    chats.owner = owner;

                    resolve(chats);
                });
            }
        });
    }
    // #endregion           
                
    // #region Creation Methods
    createUser(username, password, email) {
        return this.insertData('users', {
            username: username,
            password: password,
            email: email,
            token: this.generateToken(),
            created_at: this.timeNow()
        });
    }
    
    createChat(name, owner) {
        return this.insertData('chats', {
            name: name,
            owner: owner,
            created_at: this.timeNow()
        });
    }
    
    async createMessage(content, author, chat) {
        var message = await this.insertData('messages', {
            content: content,
            author: author,
            chat: chat,
            created_at: this.timeNow()
        });

        return this.handleMessages(message);
    }
    // #endregion
    
    // #region Get Methods
    getUser = (id) => this.getData('users', id);
    getUserSafe = (id) => this.getUser(id).then((user) => safeUser(user));
    getChat = async (id) => {
        try {
            return this.handleChats(await this.getData('chats', id));
        } catch (error) {
            throw error;
        }
    };
    getMessage = async (id) => {
        try {
            return this.handleMessages(await this.getData('messages', id));
        } catch (error) {
            throw error;
        }
    };
    
    getUsers = () => this.getAllData('users');
    getUsersSafe = () => this.getUsers().then((users) => safeUser(users));
    getChats = async () => {
        try {
            return this.handleChats(await this.getAllData('chats'));
        } catch (error) {
            throw error;
        }
    }
    getMessages = async (chat) => {
        try {
            return this.handleMessages(await this.getAllDataWhere('messages', 'chat = ?', [chat]));
        } catch (error) {
            throw error;
        }
    }
    
    getUsersFrom = (start, limit) => this.getAllDataFrom('users', start, limit);
    getUsersFromSafe = (start, limit) => this.getUsersFrom(start, limit).then((users) => safeUser(users));
    getChatsFrom = async (start, limit) => {
        try {
            return this.handleChats(await this.getAllDataFrom('chats', start, limit));
        } catch (error) {
            throw error;
        }
    }
    getMessagesFrom = async (chat, start, limit) => {
        try {
            return this.handleMessages(await this.getAllDataFromWhere('messages', start, limit, 'chat = ?', [chat]));
        } catch (error) {
            throw error;
        }
    }
    
    getUserByPassword(email, password) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    getUserByToken(token) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users WHERE token = ?`, token, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
    // #endregion
    
    // #region Search Methods
    searchUsers = (data) => this.searchData('users', data);
    searchUsersSafe = (data) => {
        return new Promise((resolve, reject) => {
            delete data.password;
            delete data.token;
            this.searchUsers(data).then((users) => {
                resolve(safeUser(users));
            });
        });
    };
    searchChats = async (data) => this.handleChats(await this.searchData('chats', data));
    searchMessages = async (data) => this.handleMessages(await this.searchData('messages', data));
    // #endregion
    
    // #region Update Methods
    updateUser = (id, data) => this.updateData('users', id, data);
    updateChat = (id, data) => this.updateData('chats', id, data);
    updateMessage = (id, data) => this.updateData('messages', id, data);
    // #endregion
    
    // #region Delete Methods
    deleteUser = (id) => this.deleteData('users', id);
    deleteChat = (id) => this.deleteData('chats', id);
    deleteMessage = (id) => this.deleteData('messages', id);
    // #endregion
}

/**
 * Converts either a single user object or array of users
 * into 'safe users' by removing sensitive information,
 * including the **password** and **token**.
 * @param {*} user
 */
function safeUser(user) {
    if (Array.isArray(user)) {
        return user.map((user) => {
            return safeUser(user);
        });
    } else {
        delete user.password;
        delete user.token;

        return user;
    }
}

module.exports = {
    Database: Database,
    alreadyExists: 19, notFound: 20, invalid: 21
};
