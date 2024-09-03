import pino from "pino";
import emoji from "./emoji";
import env from "./env";

if (env("LOGGER_CLEAR", false))
  console.clear();

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
function logFormatted(
  level: string,
  message: string,
  bracketColor: Color = [255, 255, 255]
) {
  const time = colorString(
    "[" +
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
      }) +
      "]",
    [50, 100, 100]
  );

  console.log(
    time +
      " " +
      colorString("[", bracketColor) +
      level +
      colorString("] ", bracketColor) +
      message
  );
}

/**
 * Joins arguments into a single string, formatting objects as JSON.
 * @param args The arguments to join.
 * @param color The color to use for string arguments.
 * @returns The joined string.
 */
function joinArgs(args: any[], color: Color) {
  return args
    .map((arg) => {
      const last = args.indexOf(arg) === args.length - 1;
      const lastSpace = last ? "" : " ";
      const lastNewline = last ? "" : "\n";
      switch (typeof arg) {
        case "object": {
          const stringifySL = JSON.stringify(arg);
          if (stringifySL.length > 100)
            return (
              "\n" +
              colorString(JSON.stringify(arg, null, 2), [100, 200, 255]) +
              lastNewline
            );
          else return colorString(stringifySL, [100, 200, 255]) + lastSpace;
        }
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

      arg = arg.replace(
        /:([a-zA-Z0-9_]+):/g,
        (match: string, emojiName: string) => {
          return emoji[emojiName] || match;
        }
      );

      return colorString(arg, color) + lastSpace;
    })
    .join("");
}

/**
 * Refines an object to only contain the specified attributes.
 * @param obj The object to refine.
 * @param attributes The attributes to keep.
 * @param exclude The attributes to exclude.
 * @returns The refined object.
 * @example attributeObject({ hello: 123, world: 456 }, ["hello"]) => { hello: 123 }
 * @example attributeObject({ hello: { value: 123 }, world: ...}, ["hello.value"]) => { hello: { value: 123 } }
 * @example attributeObject({ hello: 123, world: 456 }, null, ["world"]) => { hello: 123 }
 */
export function attributeObject(
  obj: { [key: string]: any },
  attributes?: string[] | null,
  exclude?: string[] | null
): { [key: string]: any } {
  const newObj: { [key: string]: any } = {};

  const setNestedValue = (target: any, path: string[], value: any) => {
    let current = target;
    for (let i = 0; i < path.length - 1; i++) {
      const part = path[i];
      current[part] = current[part] || {};
      current = current[part];
    }
    current[path[path.length - 1]] = value;
  };

  const deleteNestedValue = (target: any, path: string[]) => {
    let current = target;
    for (let i = 0; i < path.length - 1; i++) {
      const part = path[i];
      if (!current[part]) return;
      current = current[part];
    }
    delete current[path[path.length - 1]];
  };

  // If attributes are specified, only include those
  if (attributes) {
    for (const attribute of attributes) {
      const parts = attribute.split(".");
      let current = obj;
      for (let i = 0; i < parts.length; i++) {
        if (current[parts[i]] === undefined) break;
        if (i === parts.length - 1) {
          setNestedValue(newObj, parts, current[parts[i]]);
        } else {
          current = current[parts[i]];
        }
      }
    }
  } else {
    Object.assign(newObj, obj);
  }

  // Exclude specified attributes
  if (exclude) {
    for (const key of exclude) {
      const parts = key.split(".");
      deleteNestedValue(newObj, parts);
    }
  }

  return newObj;
}

/**
 * A static logger instance that formats and logs messages to the console.
 */
export const logger = {
  /** Logs a message with the INFO level. */
  info: (...args: any[]) => {
    logFormatted(
      colorString("INFO", [0, 255, 0]),
      joinArgs(args, [200, 250, 200])
    );
  },
  /** Alias for info method. Logs a message with the INFO level. */
  log: (...args: any[]) => {
    logger.info(...args);
  },
  /** Logs a message with the DEBUG level. */
  debug: (...args: any[]) => {
    logFormatted(
      colorString("DEBUG", [120, 120, 120]),
      joinArgs(args, [100, 100, 100]),
      [100, 100, 100]
    );
  },
  /** Logs a message with the WARN level. */
  warn: (...args: any[]) => {
    logFormatted(
      colorString("WARN", [255, 255, 0]),
      joinArgs(args, [255, 255, 0]),
      [150, 200, 10]
    );
  },
  /** Logs a message with the ERROR level. */
  error: (...args: any[]) => {
    logFormatted(
      colorString("ERROR", [250, 50, 50]),
      joinArgs(args, [255, 150, 150]),
      [250, 50, 50]
    );
  },
  /** Just for special prints, like a CLI banner, eg */
  system: (...args: any[]) => {
    logFormatted(
      colorString("SYSTEM", [230, 150, 255]),
      joinArgs(args, [255, 130, 255]),
      [255, 200, 255]
    );
  },
};

logger.debug("Logger initialized :magic:");

export default logger;
