const http = require('http');
const ws = require('ws');
const zenex = require('..');

var zen = zenex();
zen.addStatic('public');
const server = zen.createServer();
// To Implement socket.io:
// const io = socketIO(server);

zen.variables.world = "world!";
zen.variables.example = 0;

zen.use((req, res, next) => {
    zen.variables.example++;
    next();
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
