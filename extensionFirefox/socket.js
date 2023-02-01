var globalServer = "https://webpitch.net";

/**
 * @type {SocketIOClient.Socket}
 */
var socket = io(globalServer);

socket.on('connect', () => {
    logMsg("Connected to server.");
});

socket.on('disconnect', () => {
    logMsg("Disconnected from server.");
});

socket.on('error', (err) => {
    logMsg("Error: " + err);
});

logMsg("a");