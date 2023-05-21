const _server = "http://localhost:3001";
const socket = io(_server);

socket.on('connect', () => {
    console.log("Connected to server at", _server);
});
