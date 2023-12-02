const database = require('./database');
const accountRoutes = require('./routes/accountRoutes');
const express = require('express');
const User = require('./models/User');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid');
const socketIO = require('socket.io');
const placeHandler = require('./socketHandlers/placeHandler');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const customIdGenerator = () => {
    console.log('gen')
    return uuid.v4();
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    genid: customIdGenerator,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true
    },
    store: new SequelizeStore({
        db: database,
    })
});
app.use(sessionMiddleware);

app.use('/api', accountRoutes);
app.use(express.static('public'));

const server = require('http').createServer(app);
const io = socketIO(server);

io.on('connection', async (socket) => {
    placeHandler(io, socket);
});

io.engine.use(sessionMiddleware);

database.sync({
    force: false
}).then(() => {
    server.listen(8080, () => {
        console.log('Server running on port 8080');
    });
});

