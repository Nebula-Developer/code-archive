const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const accounts = require('./accounts');
const util = require('./util');

const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'), (err) => {
    if (util.handleError(err)) return;

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
            name TEXT NOT NULL UNIQUE
        )
    `);
});

function createGroup(name) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get('SELECT * FROM groups WHERE name = ?', [name], (err, row) => {
                if (util.handleError(err) || row) return resolve(null);

                db.run('INSERT INTO groups (name) VALUES (?)', [name], function(err) {
                    if (util.handleError(err)) return resolve(null);
                    resolve(this.lastID);
                });
            });
        });
    });
}

function getGroups() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all('SELECT * FROM groups', (err, rows) => {
                if (util.handleError(err)) return resolve(null);
                resolve(rows);
            });
        });
    });
}

function createPost(title, content, group_id, author) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('INSERT INTO posts (title, content, group_id, author, date) VALUES (?, ?, ?, ?, ?)', [title, content, group_id, author, new Date().toISOString()], function(err) {
                if (util.handleError(err)) return resolve(null);
                resolve(this.lastID);
            });
        });
    });
}

function getJoinedPosts(where = '', single = false, sort = false) {
    var select = `
        posts.id, posts.title, posts.content, posts.group_id, posts.author, posts.date,
        groups.name AS group_name,
        users.email AS author_email, users.password AS author_password
    `;

    var query = `
        SELECT ${select}
        FROM posts
        INNER JOIN groups ON posts.group_id = groups.id
        INNER JOIN users ON posts.author = users.id
        ${where}
    `;

    if (sort) query += 'ORDER BY posts.date DESC';

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(query, (err, rows) => {
                if (util.handleError(err)) return resolve(null);

                if (single) return resolve(rows[0]);
                else resolve(rows);
            });
        });
    });
}

function getPosts(limit = -1) { return getJoinedPosts(limit == -1 ? '' : `LIMIT ${limit}`); }
function getPostsByGroup(group_id, limit = -1) { return getJoinedPosts(`WHERE posts.group_id = ${group_id} ${limit == -1 ? '' : `LIMIT ${limit}`}`); }
function getPost(id) { return getJoinedPosts(`WHERE posts.id = ${id}`, true, false); }

function searchPosts(group, search, limit = -1) {
    return new Promise(async (resolve, reject) => {
        if (group == 'all') {
            var groupPosts = await getPosts(limit);
        } else {
            var groupPosts = await getPostsByGroup(group, limit);
        }

        if (!groupPosts) return resolve(null);

        var results = [];
        search = search.toLowerCase();
        var searchWords = search.split(' ');

        for (var i = 0; i < groupPosts.length; i++) {
            var score = 0;
            var post = groupPosts[i];
            var title = post.title.toLowerCase();

            if (title.includes(search)) score += 1;
            if (title.startsWith(search)) score += 2;

            for (var j = 0; j < searchWords.length; j++) {
                if (title.includes(searchWords[j])) score += 1;
            }

            if (score > 0) results.push({
                score: score,
                post: post
            });
        }

        results.sort((a, b) => {
            return b.score - a.score;
        });

        var posts = [];
        for (var i = 0; i < results.length; i++) {
            posts.push(results[i].post);
        }

        resolve(posts);
    });
}

function test() {
    createGroup("Test").then((groupID) => {
        console.log(groupID);
    
        createPost("Test", "Test", groupID, 1).then((postID) => {
            console.log(postID);
            getPost(postID).then((post) => {
                console.log(post);
            });
        });
    });
}

module.exports = {
    createGroup, getGroups,
    createPost, getPosts,
    getPostsByGroup, getPost,
    searchPosts
};
