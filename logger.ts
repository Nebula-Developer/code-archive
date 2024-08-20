import pino from "pino";

/**
 * Pino logger instance
 */
export const loggerPino = pino({
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

type Color = [number, number, number];

function colorString(str: string, color: Color) {
  return `\x1b[38;2;${color[0]};${color[1]};${color[2]}m${str}\x1b[0m`;
}

function logFormatted(level: string, message: string, bracketColor: Color = [255, 255, 255]) {
  console.log(colorString("[", bracketColor) + level + colorString("] ", bracketColor) + message);
}

console.log(colorString("test", [255,100,50]));

function joinArgs(args: any[], color: Color) {
  return args.map((arg) => {
    var last = args.indexOf(arg) === args.length - 1;
    if (typeof arg === "object") {
      return "\n" + colorString(JSON.stringify(arg, null, 2), [10,30,100]) + (last ? "" : "\n");
    }
    return colorString(arg, color) + (last ? "" : " ");
  }).join("");
}

export const logger = {
  log: (...args) => {
    logFormatted(colorString("INFO", [0, 255, 0]), joinArgs(args, [0, 40, 0]));
  },
  debug: (...args) => {
    logFormatted(colorString("DEBUG", [50, 50, 50]), joinArgs(args, [10, 10, 10]), [50, 50, 50]);
  },
  warn: (...args) => {
    logFormatted(colorString("WARN", [255, 255, 0]), joinArgs(args, [255, 255, 0]), [150, 200, 10]);
  },
  error: (...args) => {
    logFormatted(colorString("ERROR", [255, 0, 0]), joinArgs(args, [255, 0, 0]), [200, 0, 0]);
  },
};

logger.warn("test", "hello", "world", { test: "test" }, "world");
export default logger;
