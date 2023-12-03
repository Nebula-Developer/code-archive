const accountRoutes = require('./routes/accountRoutes');
const express = require('express');
const User = require('./models/User');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const database = require('./database');

const app = express();

const server = require('http').createServer(app);
app.server = server;

const customIdGenerator = () => {
    console.log('gen')
    return uuid.v4();
};

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
app.sessionMiddleware = sessionMiddleware;

app.use('/api', accountRoutes);
app.use(express.static('public'));

module.exports = app;
