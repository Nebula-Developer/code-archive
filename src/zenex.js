const fs = require('fs');
const mimetypes = require('./mimetypes');
const Transform = require('stream').Transform;
const paths = require('path');
const websocket = require('ws');

module.exports = function() {
    var app = (req, res) => {
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

        if (path === '/favicon.ico' && !fs.existsSync('public/favicon.ico')) {
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


    return app;
}
