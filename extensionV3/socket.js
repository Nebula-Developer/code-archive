var globalServer = "https://webpitch.net";

/**
 * @type {SocketIOClient.Socket}
 */
var socket = io(globalServer);

socket.on('connect', () => {
    logMsg("Connected to server.");
});
