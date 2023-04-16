const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const paths = require('./src/paths');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');

const app = express();
const server = require('http').Server(app);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use(cookieParser('otakaro-histories-cookie-secret-123'));

app.get('/css/tailwind.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'tailwind.css'));
});

function formatRenderVars(req, res) {
    var files = fs.readdirSync(paths.files).filter(f => fs.statSync(path.join(paths.files, f)).isDirectory());

    return {
        user: req.cookies.user,
        files: files,
        baseDir: paths.public
    };
}

app.get('/', (req, res) => {
    res.render(paths.getPages('home/index.ejs'), formatRenderVars(req, res));
});

// On get:
// /browse/...
function readBrowseDir(dir) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;
    var files = fs.readdirSync(dir);
    var children = [];
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var stats = fs.statSync(path.join(dir, file));
        
        if (stats.isDirectory()) {
            children.push(readBrowseDir(path.join(dir, file)));
        } else {
            children.push({
                name: file,
                isDir: false,
                path: path.join(dir, file).replace(paths.files, '')
            });
        }
    }

    return {
        name: path.basename(dir), isDir: true,
        children: children,
        path: path.join(dir).replace(paths.files, '')
    };
}

app.get('/browse/*', (req, res) => {
    var file = req.path.replace('/browse/', '');
    file = decodeURI(file);
    
    console.log(file, paths.getFiles(file));
    if (!fs.existsSync(paths.getFiles(file))) return res.status(404).send('404 Not Found');

    if (fs.statSync(paths.getFiles(file)).isDirectory()) {
        res.render(paths.getPages('browse/browse.ejs'), {
            ...formatRenderVars(req, res),
            browse: readBrowseDir(paths.getFiles(file))
        });
    } else {
        var ext = path.extname(file);
        if (ext == '.post') {
            res.render(paths.getPages('browse/post.ejs'), {
                ...formatRenderVars(req, res),
                data: JSON.parse(fs.readFileSync(paths.getFiles(file), 'utf8'))
            });
        } else {
            res.sendFile(paths.getFiles(file));
        }
    }
});

app.get('/browse', (req, res) => {
    res.render(paths.getPages('browse/browse.ejs'), {
        ...formatRenderVars(req, res),
        browse: {
            ...readBrowseDir(paths.files),
            name: 'All'
        }
    });
});

function readAll(dir) {
    var files = fs.readdirSync(dir);

    var children = [];
    for (var i = 0; i < files.length; i++) {
        if (fs.statSync(path.join(dir, files[i])).isDirectory()) {
            children.push(...readAll(path.join(dir, files[i])));
        }
        children.push(path.join(dir, files[i]).replace(paths.files, ''));
    }

    return children;
}

app.get('/search*', (req, res) => {
    var query = req.path.replace('/search/', '');
    query = decodeURI(query);
    if (!query) return res.redirect('/browse');

    var files = readAll(paths.files);
    
    var results = [];
    var lowerQuery = query.toLowerCase();

    for (var i = 0; i < files.length; i++) {
        var score = 0;
        var file = files[i];
        var fileName = path.basename(file);
        var lowerFileName = fileName.toLowerCase();

        if (lowerFileName.includes(lowerQuery)) {
            score += 100;
        }

        if (lowerFileName.startsWith(lowerQuery)) {
            score += 50;
        }

        if (lowerFileName.endsWith(lowerQuery)) {
            score += 50;
        }

        if (score > 0) {
            results.push({
                file: file,
                score: score,
                name: fileName
            });
        }
    }

    results.sort((a, b) => b.score - a.score);
    res.render(paths.getPages('browse/search.ejs'), {
        ...formatRenderVars(req, res),
        search: {
            query: query,
            results: results
        }
    });
});

function staticEJSMiddleware(p) {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    return (req, res, next) => {
        const handleEJS = () => {
            var file = path.join(p, req.path.endsWith('/') ? req.path + 'index.ejs' : req.path + '.ejs');
            file = path.resolve(file);
            if (file.startsWith('/')) file = paths.public + file;
            if (!file.startsWith(p)) return next();
            
            if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return next();
            console.log("Load: " + file)
            return res.render(file, formatRenderVars(req, res));
        };

        if (req.path.endsWith('.ejs'))
            return handleEJS();

        return express.static(p)(req, res, () => {
            if (req.path.endsWith('/'))
                return handleEJS();
            
            next();
        });
    };
}

app.use(staticEJSMiddleware(paths.public));

app.use((req, res) => {
    var newPath = !req.path.includes('.') ? req.path + '/index.ejs' : req.path;
    if (!fs.existsSync(paths.getPages(newPath))) return res.status(404).send('404 Not Found');
    if (newPath.endsWith('ejs')) res.render(paths.getPages(newPath), formatRenderVars(req, res));
    else res.sendFile(paths.getPages(newPath));
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
