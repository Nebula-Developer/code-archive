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

/**
 * RGB color type for use with true color terminal output.
 */
type Color = [number, number, number];

/**
 * Colors a string with an RGB color. (True color)
 * @param str The string to color.
 * @param color The color to use.
 * @returns The colored string.
 */
function colorString(str: string, color: Color) {
  return `\x1b[38;2;${color[0]};${color[1]};${color[2]}m${str}\x1b[0m`;
}

/**
 * Logs a formatted message to the console.
 * @param level The level of the message.
 * @param message The message to log.
 * @param bracketColor The color of the brackets around the level.
 */
function logFormatted(level: string, message: string, bracketColor: Color = [255, 255, 255]) {
  console.log(colorString("[", bracketColor) + level + colorString("] ", bracketColor) + message);
}

/**
 * Joins arguments into a single string, formatting objects as JSON.
 * @param args The arguments to join.
 * @param color The color to use for string arguments.
 * @returns The joined string.
 */
function joinArgs(args: any[], color: Color) {
  return args.map((arg) => {
    var last = args.indexOf(arg) === args.length - 1;
    var lastSpace = last ? "" : " ";
    var lastNewline = last ? "" : "\n";
    switch (typeof arg) {
      case "object":
          var stringifySL = JSON.stringify(arg);
          if (stringifySL.length > 100)
            return "\n" + colorString(JSON.stringify(arg, null, 2), [10,30,100]) + lastNewline;
          else
            return colorString(stringifySL, [10,30,100]) + lastSpace;
      case "boolean":
        return colorString(arg.toString(), [230, 100, 250]) + lastSpace;
      case "number":
      case "bigint":
        return colorString(arg.toString(), [100, 200, 200]) + lastSpace;
      case "function":
        return colorString("[Function]", [150, 200, 200]) + lastSpace;
      case "undefined":
        return colorString("undefined", [150, 150, 200]) + lastSpace;
    }
    
    return colorString(arg, color) + lastSpace;
  }).join("");
}

/**
 * A static logger instance that formats and logs messages to the console.
 */
export const logger = {
  /** Logs a message with the INFO level. */
  log: (...args: any[]) => {
    logFormatted(colorString("INFO", [0, 255, 0]), joinArgs(args, [0, 40, 0]));
  },
  /** Logs a message with the DEBUG level. */
  debug: (...args: any[]) => {
    logFormatted(colorString("DEBUG", [50, 50, 50]), joinArgs(args, [10, 10, 10]), [50, 50, 50]);
  },
  /** Logs a message with the WARN level. */
  warn: (...args: any[]) => {
    logFormatted(colorString("WARN", [255, 255, 0]), joinArgs(args, [255, 255, 0]), [150, 200, 10]);
  },
  /** Logs a message with the ERROR level. */
  error: (...args: any[]) => {
    logFormatted(colorString("ERROR", [250, 50, 50]), joinArgs(args, [255, 150, 150]), [250, 50, 50]);
  },
};

export default logger;
