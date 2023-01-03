const zenex = require('./src/zenex');
const http = require('http');
const ws = require('ws');

var zen = zenex();
zen.addStatic('public');
const server = zen.createServer();

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
