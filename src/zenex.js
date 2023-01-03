const fs = require('fs');
const mimetypes = require('./mimetypes');
const Transform = require('stream').Transform;
const paths = require('path');
const websocket = require('ws');

module.exports = function() {
    var app = (req, res) => {
        for (var i = 0; i < app.middleware.length; i++) {
            app.middleware[i](req, res, () => {});
        }

        if (!req || !res) return;
        var path = req.url;
        if (path === '/') path = '/index.html';
        if (path === '/zenex/web/script') {
            res.writeHead(200, {
                'Content-Type': 'text/javascript'
            });

            var zenexWebConstructor = {
                active: true,
                connections: app.connections + 1,
                server: {
                    cpu: {
                        cores: require('os').cpus().length,
                        load: require('os').loadavg()[0]
                    },
                    memory: {
                        total: require('os').totalmem(),
                        free: require('os').freemem()
                    },
                    uptime: process.uptime()
                }
            }

            res.end(`
                // Zenex primary define
                var Zenex = ` + JSON.stringify(zenexWebConstructor) + `;
                // Primary websocket
                var ZenexWebsocket = new WebSocket('ws://' + window.location.host);
            `);
            
            return;
        } else if (path === '/zenex/web/stylesheet') {
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });

            res.end(`
                zenex { display: none !important; }
            `);
            return;
        }
        else if (path === '/favicon.ico' && !fs.existsSync('public/favicon.ico')) {
            var img = fs.readFileSync(paths.join(__dirname, 'Favicon.ico'));
            res.writeHead(200, {
                'Content-Type': 'image/x-icon'
            });
            res.end(img, 'binary');
            return;
        }

        var found = null;
        for (var i = 0; i < app.static.length; i++) {
            var p = app.static[i] + path;
            if (path.endsWith('.raw')) p = p.substring(0, p.length - 4);
            if (fs.existsSync(p)) {
                found = p;
                break;
            }
        }

        if (!found) {
            // check if + .html exists, if so, use that.
            for (var i = 0; i < app.static.length; i++) {
                var p = app.static[i] + path + '.html';
                if (fs.existsSync(p)) {
                    found = p;
                    break;
                }
            }
        }

        if (!found) {
            res.writeHead(404);
            res.end('404 Not Found');
            return;
        }

        var ext = paths.extname(found).substring(1);
        var mime = mimetypes[ext] || 'text/plain';
        
        res.writeHead(200, {
            'Content-Type': mime
        });

        var stream = fs.createReadStream(found);

        var mainModifier = new Transform({
            transform: (chunk, encoding, callback) => {
                if (mime === 'text/html') {
                    var str = chunk.toString();
                    var head = "<script src='/zenex/web/script' zenex></script>";
                    head += "<link rel='stylesheet' href='/zenex/web/stylesheet' zenex>";
                    str = str.replace('</head>', head + '</head>');
                    chunk = Buffer.from(str);
                }
                else if (mime == 'text/css') {
                    if (path.endsWith('.raw')) {
                        callback(null, chunk);
                        return;
                    }

                    var foundNoStatic = found.substring(found.indexOf('/') + 1);
                    var str = "/* This file has been modified automatically by Zenex */\n/* Go to '" + foundNoStatic + ".raw' For unmodified file */\n\n" + chunk.toString();
                    var regex = /var\s+([a-zA-Z0-9_]+)\s*=\s*([^;]+);/g;
                    var match;
                    while (match = regex.exec(str)) {
                        var name = match[1];
                        var value = match[2];
                        var replacement = '--' + name + ': ' + value + ';';

                        var isInCurlyBraces = false;
                        var open = 0;
                        for (var i = 0; i < match.index; i++) {
                            if (str[i] === '{') open++;
                            else if (str[i] === '}') open--;
                        }
                        
                        if (open === 0) {
                            replacement = ':root { ' + replacement + ' }';
                        }

                        str = str.replace(match[0], replacement);
                        str = str.replace(new RegExp('\\$' + name + '(?![a-zA-Z0-9_])', 'g'), 'var(--' + name + ')');
                    }

                    str = str.replace(/\/\/(.*)\n/g, (match, p1) => {
                        return '/*' + p1 + '*/\n';
                    });
                    chunk = Buffer.from(str);
                }

                if (mime === 'text/html' || mime === 'text/javascript') {
                    // Replace variables
                    var str = chunk.toString();
                    // Replace variables in string like:
                    // (quote) ... $<name> ... (quote)
                    // With:
                    // (quote) ... var(--<name>) ... (quote
                    str = str.replace(/("|')([^"']*)\$([a-zA-Z0-9_]+)?;([^"']*)("|')/g, (match, p1, p2, p3, p4, p5) => {
                        return p1 + p2 + 'var(--' + p3 + ');' + p4 + p5;
                    });

                    chunk = Buffer.from(str);
                }

                if (mime === 'text/html' || mime === 'text/css' || mime === 'text/javascript') {
                    // Replace:
                    // {{<varname>}}
                    // with the value of the variable from here
                    var str = chunk.toString();
                    var regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
                    var match;
                    while (match = regex.exec(str)) {
                        var name = match[1];
                        var value = app.variables[name];
                        if (value) {
                            str = str.replace(match[0], value);
                        }
                    }
                    chunk = Buffer.from(str);
                }
                callback(null, chunk);
            }
        });

        stream.pipe(mainModifier).pipe(res);

        stream.on('error', (err) => {
            res.writeHead(500);
            res.end('500 Internal Server Error');
        });

        stream.on('end', () => {
            res.end();
        });
    };

    app.middleware = [];
    app.use = (middleware) => {
        app.middleware.push(middleware);
    };

    app.static = [];

    app.addStatic = (path) => {
        if (!path) return;
        app.static.push(path);
    };

    app.createServer = () => {
        var server = require('http').createServer(app);
        var wss = new websocket.Server({ server });
        app.connections = 0;
        wss.on('connection', (ws) => {
            app.connections++;
            ws.on('close', () => {
                app.connections--;
            });
        });
        server.wss = wss;
        return server;
    };

    app.variables = {};

    return app;
}
