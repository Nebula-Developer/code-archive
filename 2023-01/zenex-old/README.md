# Zenex - Blazing fast extension for developing your web server

Zenex is a library that allows creating web servers as fast as possible, without the need of seperate libraries for routing, templating, etc.

## Installation

To install Zenex, simply run the following command:

```npm install zenex```

## Usage

To use Zenex, include the necessary packages:

```js
const zenex = require('zenex');
const http = require('http');
```

Then, create a new server:

```js
var zen = zenex();
zen.addStatic('public'); // Add a static folder
const server = zen.createServer();

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

That's it! You now have a web server running on port 3000.

If you would like to add middleware, you can do so by using the `use` method:

```js
zen.use((req, res, next) => {
  console.log('Middleware called!');
  next();
});
```