
const socket = io('https://nebuladev.net', {
    transports: ['websocket', 'polling']
});

console.log(socket);

var windowA = new NWindow("Nebula", 0, 0, true);
windowA.create("Hello World");
