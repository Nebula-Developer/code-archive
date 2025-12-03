const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
            const timestamp = new Date(info.timestamp);
            const iso8601 = timestamp.toISOString();
            const formattedTimestamp = iso8601.slice(0, 19).replace("T", " ");
            return `[${formattedTimestamp}] [${info.level.toUpperCase()}]: ${info.message}`;
        }),
        winston.format.colorize({ all: true })
    ),
    transports: [
        new winston.transports.File({ filename: 'temp/ServerLog.log' }),
        new winston.transports.Console()
    ],
    exitOnError: false
});

module.exports = logger;
