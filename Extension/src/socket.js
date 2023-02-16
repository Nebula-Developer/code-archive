const socket = io('https://flow.nebuladev.net');

socket.on('connect', () => {
    if (localStorage.getItem('token')) {
        loginToken(localStorage.getItem('token'), (error) => {
            console.log(error);
        });
    }
    else if (sessionStorage.getItem('token')) {
        loginToken(sessionStorage.getItem('token'), (error) => {
            console.log(error);
        });
    }
});
