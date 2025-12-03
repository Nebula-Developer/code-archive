const winston = require("winston");
const env = require("./env");

var transports = [
	new winston.transports.File({ filename: "combined.log", level: "info" }),
];

let alignColorsAndTime = winston.format.combine(
	winston.format.colorize({
		all: true,
	}),
	winston.format.label({
		label: "[LOGGER]",
	}),
	winston.format.timestamp({
		format: "YY-MM-DD HH:mm:ss",
	}),
	winston.format.printf(
		(info) =>
			` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`,
	),
);

if (process.env.NODE_ENV !== "production")
	transports.push(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				alignColorsAndTime,
			),
			level: env.debug ? "debug" : "info",
		}),
	);

const logger = winston.createLogger({
	transports: transports,
});

module.exports = logger;
