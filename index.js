const zenex = require('./src/zenex');
const http = require('http');
const ws = require('ws');

var zen = zenex();
zen.addStatic('public');
const server = zen.createServer();
// To Implement socket.io:
// const io = socketIO(server);

console.log(zen.variables)
zen.variables.world = "world!";
zen.variables.example = 0;

zen.use((req, res) => {
    zen.variables.example++;
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
