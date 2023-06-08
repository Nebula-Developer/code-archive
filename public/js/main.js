const socket = io();

socket.on('redirect', (url) => {
    location.href = url;
});
