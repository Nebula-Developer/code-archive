import { Server as IOServer, Socket } from "socket.io";
import { Server } from "http";
import PlaceGame from "./placeGameManager";
import logger from "./logger";
import User, { safeUser } from "./models/User";
import jwt from "./jwt";
import hash from "./hash";
import { JwtPayload } from "jsonwebtoken";

/**
 * The result of an operation that is returned to the client or sender.
 */
export type Result = {
  /** Whether the operation was successful or not. */
  success: boolean;
  /** The data that was returned from the operation. */
  data?: any;
  /** The error message that was returned from the operation. */
  error?: string;
};

/**
 * The http server instance that hosts the socket.io server.
 */
export const httpServer = new Server((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

/**
 * The socket.io server instance.
 */
export const io = new IOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

/**
 * The schema for the data types that are expected to be received from the client.
 */
export type DataTypeSchema = {
  [key: string]: { type: string; required: boolean } | string;
};

/**
 * A set of rules that determine how the socket should handle or validate the incoming data.
 */
export type SocketRules = {
  auth?: boolean;
};

/**
 * The properties that are passed to the socket handler.
 */
export type SocketHandlerProps = {
  /** The data that was received from the client. */
  data: { [key: string]: any };
  /** A callback that should be called when the operation was successful. */
  success: (data?: any) => void;
  /** A callback that should be called when the operation failed. */
  error: (error: string) => void;
  /** The raw callback function that was passed by the client (try to avoid using this). */
  callback: (...args: any[]) => void;
  /** The user that is authenticated with the socket. */
  user: User | null;
};

/**
 * List of all socket listeners registered by `socketListener`.
 *
 * Example of a socket listener:
 * ```ts
 * socketListeners["say"] = {
 *  handler: ({ data, success }) => {
 *    logger.info("Client said: " + data.message);
 *    success();
 *  },
 *  rules: { auth: true },
 *  datatypes: {
 *    message: {
 *      required: true,
 *      type: "string",
 *    },
 *  },
 * };
 * ```
 */
export let socketListeners: {
  [key: string]: {
    handler: (props: SocketHandlerProps) => void;
    datatypes?: DataTypeSchema;
    rules?: SocketRules;
  };
} = {};

/**
 * Registers a new safe socket listener with the given name, handler, datatypes, and rules.
 *
 * The event will be registered with all new socket connections.
 * @param name The name of the socket event from the client.
 * @param handler The handler function that will be called when the event is received.
 * @param datatypes The schema for the data types that are expected to be received from the client.
 * @param rules A set of rules that determine how the socket should handle or validate the incoming data.
 */
export function registerSocketListener(
  name: string,
  handler: (props: SocketHandlerProps) => void,
  datatypes?: DataTypeSchema,
  rules?: SocketRules
) {
  socketListeners[name] = { handler, datatypes, rules };
}

/**
 * Removes a socket listener with the given name.
 * @param name The name of the socket event to remove.
 */
export function removeSocketListener(name: string) {
  delete socketListeners[name];
}

/**
 * Authenticates a socket connection with the given handshake JWT token.
 * @param socket The socket connection that is being authenticated.
 * @returns The user that is authenticated with the socket, or null if the token is invalid or missing.
 */
export async function authenticateSocket(socket: Socket): Promise<User | null> {
  if (socket.handshake.auth) {
    try {
      const token = socket.handshake.auth.jwt;
      const decoded: any | null = jwt.verifyToken(token);

      if (decoded) {
        return await User.findByPk(decoded.id);
      }
    } catch {
      return null;
    }
  }

  return null;
}

io.on("connection", (socket) => {
  var user: User | null = null;

  authenticateSocket(socket).then((u) => {
    user = u;
    socket.emit("auth", {
      success: !!u,
      user: u ? safeUser(u) : null,
      error: u ? undefined : "Invalid token",
    });
  });

  /**
   * Registers a new safe socket listener within the socket connection.
   * @param name The name of the socket event from the client.
   * @param handler The handler function that will be called when the event is received.
   * @param datatypes The schema for the data types that are expected to be received from the client.
   * @param rules A set of rules that determine how the socket should handle or validate the incoming data.
   */
  function innerSocketListener(
    name: string,
    handler: (props: SocketHandlerProps) => void,
    datatypes?: DataTypeSchema,
    rules?: SocketRules
  ) {
    socket.on(name, (data, callback) => {
      // Falls back to an empty callback if none is provided.
      var cbk =
        !!callback && typeof callback === "function" ? callback : () => {};

      if (rules?.auth && !user) {
        cbk({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      if (!data || typeof data !== "object") {
        cbk({
          success: false,
          error: `Got incorrect data format, got '${typeof data}' expected 'object'`,
        });
        return;
      }

      if (datatypes) {
        for (const [key, raw] of Object.entries(datatypes)) {
          const entry =
            typeof raw == "string"
              ? {
                  type: raw,
                  required: true,
                }
              : raw;

          const { type, required } = entry;

          // If the key is required but is undefined or null, return an error.
          if (required && (data[key] === undefined || data[key] === null)) {
            cbk({
              success: false,
              error: `Got undefined data for required key '${key}'`,
            });
            return;
          }

          // If the key is defined but is not the correct type, return an error.
          if (data[key] !== undefined && typeof data[key] !== type) {
            cbk({
              success: false,
              error: `Invalid data type for '${key}', got '${typeof data[
                key
              ]}' expected '${type}'`,
            });
            return;
          }
        }
      }

      handler({
        data,
        success: (data) => cbk({ success: true, data }),
        error: (error) => cbk({ success: false, error }),
        callback: cbk,
        user,
      });
    });
  }

  for (const [name, listener] of Object.entries(socketListeners)) {
    innerSocketListener(
      name,
      listener.handler,
      listener.datatypes,
      listener.rules
    );
  }

  innerSocketListener(
    "register",
    async ({ data, success, error }) => {
      const { username, password, email } = data;

      try {
        var passwordHash = await hash.hash(password);
        const user = await User.create({
          username,
          password: passwordHash,
          email,
        });
        var su = safeUser(user);

        success({
          user: su,
          jwt: jwt.createToken(su),
        });
      } catch (cth: any) {
        var e = cth as Error;

        var msgComp = e.message.toLowerCase();
        if (msgComp.includes("isemail")) {
          error("Invalid email");
          return;
        }

        if (msgComp.includes("validation")) {
          error("Email already in use");
          return;
        }

        error(e.message);
      }
    },
    {
      username: "string",
      password: "string",
      email: "string",
    }
  );

  innerSocketListener(
    "login",
    async ({ data, success, error }) => {
      const { email, password } = data;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        error("Could not find an account under the provided email");
        return;
      }

      if (!hash.compare(password, user.password)) {
        error("Invalid password");
        return;
      }

      var su = safeUser(user);
      success({
        user: su,
        jwt: jwt.createToken(su),
      });
    },
    {
      email: "string",
      password: "string",
    }
  );

  socket.onAny((event) => {
    logger.debug(`Got event: ${event}`);
  });
});

/**
 * Starts the HTTP server on the given port.
 */
async function listen(port: number) {
  return httpServer.listen(port, () => {
    logger.log("Server listening on port " + port + " 🚀");
  });
}

/**
 * Holder of all server-related methods, primarily for the socket server.
 */
export default {
  listen,
  io,
  httpServer,
  authenticateSocket,
  registerSocketListener,
  removeSocketListener,
};
