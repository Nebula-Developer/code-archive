const app = require('./app');
const io = require('./io');
const database = require('./database');
const placeHandler = require('./socketHandlers/placeHandler');

console.log(io.engine)

io.on('connection', placeHandler);
io.engine.use(app.sessionMiddleware);


database.sync().then(() => {
    console.log('Database synced.');
    app.server.listen(8080, () => {
        console.log('Server listening on port 8080.');
    });
});
