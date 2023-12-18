const winston = require("winston");
const env = require('./env');

var transports = [new winston.transports.File({ filename: "combined.log", level: "info" })];
if (process.env.NODE_ENV !== "production")
	transports.push(new winston.transports.Console({ format: winston.format.simple(), level: env.debug ? "debug" : "info" }));

const logger = winston.createLogger({
	transports: transports,
});

module.exports = logger;
