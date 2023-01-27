showWelcome();

var globalServer = 'https://webpitch.net/';
var socket = io(globalServer);

socket.on('connect', () => {
    logMsg('Connected to LearnPlus server.');
});

socket.on('message', (msg) => {
    logMsg(msg);
});

function logMsg(msg) {
    console.log('%c[ LearnPlus ]%c ' + msg, 'color: #572680; font-family: courier;', 'color: #313444; font-family: courier;');
}