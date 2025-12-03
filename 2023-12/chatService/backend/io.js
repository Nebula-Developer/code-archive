const socketIO = require('socket.io');
const app = require('./app');

const io = socketIO(app.server);

// console.log("ENGINE: ", io.engine.use);

module.exports = io;
