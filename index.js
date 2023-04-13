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
    var files = fs.readdirSync(paths.files);
    return {
        user: req.cookies.user,
        files: files,
        baseDir: paths.public
    };
}

app.get('/', (req, res) => {
    res.render(paths.getPages('home/index.ejs'), formatRenderVars(req, res));
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
