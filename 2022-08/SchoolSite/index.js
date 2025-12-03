/* ----------------------------------------------------------------------------------
Note:
Socket.IO is a library that allows us to create a connection between the site that
users see, and the stuff that happens behind the scenes here in index.js.

From this, we can do things like editing files on the server (perhaps to create an account and
save information), and also to send information safely to the client (the website itself).

Express is a library that allows us to create the server that powers the website.
It also allows us to handle certain requests, and perhaps even create an API.

Creating an API allows developers to access information on the server from a program.
This can be useful for website wanting to access public files on the server, or general
information such as uptime and performance.

This here is the server, and it is used to boot up the website, and handle the connections
and information that is sent to the client. We can disallow certain files to be accessed,
make sure that the user is logged in, and so on.

Once the website is up and running, you will barely touch the code in this file. (You will
only use it for new socket handlers, most likely. [which is simple])
The hardest part is just getting the website online, once that is done, you can
start coding the visual aspects (frontend) of the website.
*/// ----------------------------------------------------------------------------------

// Below are the imports, which are essential for the program to run.
// They are libraries that are used to make the program work.
const express = require('express');
const http = require('http');

// Creating the server and socket variables:
const app = express();
const server = http.createServer(app);

// Use the socket.io library to create a socket:
const { Server } = require("socket.io");
const io = new Server(server);

// Make the web server use the public folder for the static files:
app.use(express.static('public'));

// On frontend socket connection, handle the connection:
io.on('connection', (socket) => {
    console.log('New client connected');

    // When the client emits 'message', this logs it to the console:
    socket.on('message', (data) => {
        console.log('Got new message: ' + data);
    });
});

// Turn on the web server, using the private port of 3000:
server.listen(3000, () => {
    console.log('Server listening on *:3000');
});

/* ----------------------------------------------------------------------------------
And that's it!
Now you have a server that you can use to create a website.
It will check for the 'message' event, and log the message to the console. (Which is
provided by the frontend socket connection.)

Sorry for the ton of reading, but I hope you understand the code a bit better now.
*/// ----------------------------------------------------------------------------------