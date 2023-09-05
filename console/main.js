const readline = require('readline');
const socketIOClient = require("socket.io-client");

const rl = readline.createInterface({
    input: process.stdin,
    output: null
});

const socket = socketIOClient("http://158.140.230.50:3000", {
    transports: ['polling']
});

var token = "gv0t0asna9alkfcadv5xv";

socket.on('message', (message) => {
    console.log(`\n[${message.chat.name}] ${message.author.username}: ${message.content}`);
});

socket.emit('getMessagesFrom', 1, 0, 3, (res) => {
    if (!res.success) return console.log("Error getting messages:", res.error);

    for (var message of res.data) {
        console.log(`\n[${message.chat.name}] ${message.author.username}: ${message.content}`);
    }
});

socket.emit("loginToken", token, (res) => {
    if (!res.success) return console.log("Error logging in:", res.error);
    console.log(res)
    socket.emit("joinChat", 1, (res) => {
        sendMessageLoop();
    });
});

async function sendMessageLoop() {
    while (true) {
        var message = await new Promise((resolve, reject) => {
            rl.question("", (message) => {
                resolve(message);
            });
        });

        socket.emit("createMessage", 1, message, (res) => { });

        await new Promise((resolve, reject) => { setTimeout(resolve, 100) });
    }
}


