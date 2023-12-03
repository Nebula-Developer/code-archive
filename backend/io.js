const socketIO = require('socket.io');
const app = require('./app');

const io = socketIO(app.server);

console.log("APP:", app);

// console.log("ENGINE: ", io.engine.use);

module.exports = io;
