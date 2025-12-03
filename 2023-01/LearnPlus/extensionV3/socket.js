// var globalServer = "https://webpitch.net";
// Temp:
var globalServer = "http://localhost:8008";

/**
 * @type {SocketIOClient.Socket}
 */
var socket = io(globalServer);

socket.on('connect', () => {
    logMsg("Connected to server.");
});
