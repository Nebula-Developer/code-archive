import pino from "pino";

/**
 * Pino logger instance
 */
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
    level: "trace",
  },
  level: "trace",
});

export default logger;
