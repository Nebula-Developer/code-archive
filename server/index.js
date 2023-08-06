const http = require('http');
const socketIO = require('socket.io');

const database = require('./database');
const userOperation = require('./userOperation');
const messageOperation = require('./messageOperation');

const server = http.createServer();
const io = socketIO(server);

io.on('connection', (socket) => {
    
});

database.serialize(() => {

    // userOperation.registerUser("NebulaDev", "testing@gmail.com", "testing").then((res) => {
    //     console.log(res);
    // });

    // userOperation.loginUser("testing@gmail.com", "testing").then((res) => {
    //     console.log(res);
        
    //     messageOperation.createChannel("test", res.data.id).then((resA) => {
    //         console.log(resA);
    //     });
    // });
    

    messageOperation.getMessages(2, 4, 3).then((res) => {
        console.log(res);
    });
});
