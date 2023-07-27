const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));

const accounts = require('./accounts');
const posts = require('./posts');

const app = express();
const server = http.createServer(app);
const io = new socketIO.Server(server);

function render(req, res, file, data = {}) {
    accounts.getReqAccount(req).then((acc) => {
        res.render(file, {
            account: acc,
            ...data
        });
    });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// TODO: Modify login cookie set method
app.get('/user/login/:id/:token', (req, res) => {
    accounts.setResAccount(res, req.params.id, req.params.token);
    res.redirect('/');
});

app.get('/user/logout', (req, res) => {
    accounts.removeResAccount(res);
    res.redirect('/');
});

app.get('/post/:id', (req, res) => {
    var id = req.params.id;
    if (!id) return res.redirect('/');

    posts.getPost(id).then((post) => {
        if (!post) return res.redirect('/');

        render(req, res, 'dynamic/post', { post });
    });
});

app.get('/', (req, res) => {
    posts.getPosts(3).then((post) => {
        render(req, res, 'index', {
            posts: post
        });
    });
});

app.get('/posts', (req, res) => {
    posts.getPosts(5).then((post) => {
        posts.getGroups().then((groups) => {
            render(req, res, 'dynamic/posts', {
                posts: post, groups,
                sort: 'all'
            });
        });
    });
});

app.get('/posts/:group', (req, res) => {
    posts.getPostsByGroup(req.params.group, 5).then((post) => {
        posts.getGroups().then((groups) => {
            render(req, res, 'dynamic/posts', {
                posts: post, groups,
                sort: req.params.group
            });
        });
    });
});

app.get('/posts/:group/:search', (req, res) => {
    posts.searchPosts(req.params.group, decodeURIComponent(req.params.search), 5).then((post) => {
        posts.getGroups().then((groups) => {
            render(req, res, 'dynamic/posts', {
                posts: post, groups,
                sort: req.params.group
            });
        });
    });
});

app.get('/create', (req, res) => {
    posts.getGroups().then((groups) => {
        render(req, res, 'dynamic/create', {
            groups
        });
    });
});

app.get('/edit/:id', (req, res) => {
    posts.getPost(req.params.id).then((post) => {
        if (!post) return res.redirect('/');
        posts.getGroups().then((groups) => {
            render(req, res, 'dynamic/create', {
                groups,
                editState: {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    group: post.group_id
                }
            });
        });
    });
});

// Handle views
app.get('*', (req, res) => {
    var ejsPath = path.join(__dirname, 'views', req.path + '.ejs');
    var normPath = path.join(__dirname, 'public', req.path);
    ejsPath = path.resolve(ejsPath);
    normPath = path.resolve(normPath);

    if (!ejsPath.startsWith(path.join(__dirname, 'views')) || !normPath.startsWith(path.join(__dirname, 'public'))) {
        res.write('403');
        res.end();
        return;
    }
    
    if (fs.existsSync(ejsPath)) render(req, res, ejsPath);
    else if (fs.existsSync(normPath)) res.sendFile(normPath);
    else {
        res.write(`
            <div style="padding: 30px">
                <h1 style="font-family: sans-serif; font-size: 50px; font-weight: 300; margin: 0; user-select: none;">404 - Page Not Found<h1>
                <a href="/" style="font-family: sans-serif; font-size: 20px; font-weight: 300; text-decoration: none; margin: 0; user-select: none;">Go Home</a>
            </div>
        `);
        res.end();
    }
});

function chkArgs(...args) {
    if (args.length % 2 != 0) return false;

    for (var i = 0; i < args.length; i+=2) {
        if (typeof args[i] !== args[i + 1]) return false;
    }

    return true;
}

function chkCallback(callback) {
    if (typeof callback !== 'function') return false;
    return true;
}

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('login', (data, callback) => {
        if (!chkCallback(callback)) return;
        if (!chkArgs(data.email, 'string', data.password, 'string')) {
            return callback({
                success: false,
                error: "Invalid arguments."
            });
        }

        accounts.login(data.email, data.password, callback);
    });

    socket.on('register', (data, callback) => {
        if (!chkCallback(callback)) return;
        if (!chkArgs(data.email, 'string', data.password, 'string')) {
            return callback({
                success: false,
                error: "Invalid arguments."
            });
        }

        accounts.register(data.email, data.password, callback);
    });

    socket.on('createGroup', (name, callback) => {
        if (!chkCallback(callback)) return;
        if (!chkArgs(name, 'string')) {
            return callback({
                success: false,
                error: "Invalid arguments."
            });
        }

        accounts.getSocketAccount(socket).then((acc) => {
            if (!acc) return callback({
                success: false,
                error: "You must be logged in to create a group."
            });

            posts.createGroup(name).then((id) => {
                if (id) {
                    callback({
                        success: true,
                        data: id
                    });
                } else {
                    callback({
                        success: false,
                        error: "Group already exists."
                    });
                }
            });
        });
    });

    socket.on('createPost', (data, callback) => {
        if (!chkCallback(callback)) return;
        if (!chkArgs(data.title, 'string', data.content, 'string', data.group, 'number')) {
            return callback({
                success: false,
                error: "Invalid arguments."
            });
        }

        accounts.getSocketAccount(socket).then((acc) => {
            if (!acc) return callback({
                success: false,
                error: "You must be logged in to create a post."
            });

            posts.createPost(data.title, data.content, data.group, acc.id).then((id) => {
                console.log(id);
                if (id) {
                    callback({
                        success: true,
                        data: id
                    });
                } else {
                    callback({
                        success: false,
                        error: "Failed to create group"
                    });
                }
            });
        });
    });

    socket.on('editPost', (data, callback) => {
        if (!chkCallback(callback)) return;
        if (!chkArgs(data.id, 'number', data.title, 'string', data.content, 'string', data.group, 'number')) {
            return callback({
                success: false,
                error: "Invalid arguments."
            });
        }

        accounts.getSocketAccount(socket).then((acc) => {
            if (!acc) return callback({
                success: false,
                error: "You must be logged in to edit a post."
            });

            posts.editPost(data.id, data.title, data.content, data.group, acc.id).then((id) => {
                if (id) {
                    callback({
                        success: true,
                        data: id
                    });
                } else {
                    callback({
                        success: false,
                        error: "Failed to edit post"
                    });
                }
            });
        });
    });
});

server.listen(3000, () => {
    console.log('Server on port 3000');
});
