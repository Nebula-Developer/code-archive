import {
  Server as IOServer,
  Namespace as IONamespace,
  Socket,
} from "socket.io";
import { Server } from "http";
import logger from "../logger";
import User, { safeUser } from "../models/User";
import jwt from "../jwt";
import express from "express";
import path from "path";
import { AuthSocket, SocketCallback, SocketHandler } from "./socketTypes";

import hashing from "../hashing";
import Role from "../models/Role";

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
 * The express server instance that handles the HTTP requests.
 */
const app = express();

// Public HTTP request handlers
app.get("/logo", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/assets/logo.png"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/index.html"));
});

/**
 * The http server instance that hosts the socket.io server.
 */
export const httpServer = new Server(app);

/**
 * The socket.io server instance.
 */
export const io = new IOServer(httpServer, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 1e8,
});

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

/**
 * Custom Socket.IO namespace with handlers.
 */
export class Namespace {
  /** The socket.io namespace that is being managed. */
  io: IONamespace;

  /**
   * Creates a new socket.io namespace with the given path.
   * @param path The path that the namespace will be hosted on.
   */
  constructor(path: string) {
    if (!path.startsWith("/")) path = "/" + path;

    this.io = io.of(path);
    this.io.on("connection", this.connection.bind(this));
  }

  handlers: SocketHandler[] = [];

  /**
   * Adds a new handler to the namespace.
   * @param listener The handler that will be added to the namespace.
   */
  addHandler(listener: SocketHandler) {
    this.handlers.push(listener);
  }

  /**
   * Appends a handler to a socket instance for a given handler.
   * @param socket The socket instance that the handler will be appended to.
   * @param handler The handler that will be appended to the socket.
   */
  private appendHandler(socket: AuthSocket, handler: SocketHandler) {
    socket.on(handler.name, (data?: any, callback?: SocketCallback) => {
      const cbk =
        !!callback && typeof callback === "function" ? callback : () => {};

      if (!data || typeof data !== "object") {
        cbk({
          success: false,
          error: `Got incorrect data format, got '${typeof data}' expected 'object'`,
        });
        return;
      }

      if (handler.schema) {
        for (const [key, raw] of Object.entries(handler.schema)) {
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

      handler.method({
        data,
        success: (data) => cbk({ success: true, data }),
        error: (error) => cbk({ success: false, error }),
        callback: cbk,
        socket,
        user: socket.user,
      });
    });
  }

  /**
   * Static callback for when a socket connection is unauthorized.
   * @param data The data that was received from the client.
   * @param callback The callback function that should be called when the operation is complete.
   */
  private unauthorized(data?: any, callback?: SocketCallback) {
    if (typeof callback !== "function") return;

    callback({
      success: false,
      error: "Unauthorized",
    });
  }

  /**
   * Handles a new socket connection to the namespace.
   * @param rawSocket The raw socket.io `Socket` instance that is being connected.
   */
  async connection(rawSocket: Socket) {
    const socket: AuthSocket = rawSocket;

    socket.user = (await authenticateSocket(socket)) ?? undefined;

    socket.emit("auth", {
      success: !!socket.user,
      user: socket.user ? safeUser(socket.user) : null,
      error: socket.user
        ? null
        : socket.handshake.auth?.jwt
          ? "Invalid token"
          : "No token provided",
    });

    for (const i in this.handlers) {
      const handler = this.handlers[i];
      if (handler.rules?.auth && !socket.user) {
        socket.on(handler.name, this.unauthorized);
        continue;
      }

      if (handler.rules?.admin && !socket.user?.roles?.find((r) => r.stringId === "admin")) {
        socket.on(handler.name, this.unauthorized);
        continue;
      }

      this.appendHandler(socket, handler);
    }
  }

  /**
   * Loads the current namespace, ensuring it is in use.
   */
  public load = () => io.timeout(0);
}

export const rootNamespace = new Namespace("/");

rootNamespace.addHandler({
  name: "register",
  method: async ({ data, success, error }) => {
    const { username, password, email } = data;

    try {
      const passwordHash = await hashing.hash(password);
      const user = await User.create({
        username,
        password: passwordHash,
        email,
      });
      const su = safeUser(user);

      success({
        user: su,
        jwt: jwt.createToken(su),
      });
    } catch (cth: any) {
      const e = cth as Error;

      const msgComp = e.message.toLowerCase();
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
  schema: {
    username: {
      required: true,
      type: "string",
    },
    password: {
      required: true,
      type: "string",
    },
    email: {
      required: true,
      type: "string",
    },
  },
});

rootNamespace.addHandler({
  name: "login",
  method: async ({ data, success, error }) => {
    const { email, password } = data;
    const user = await User.findOne({ where: { email }, attributes: { include: ["password"] } });

    if (!user) {
      error("Could not find an account under the provided email");
      return;
    }

    if (!await hashing.compare(password, user.password))
      return error("Invalid password");

    const su = safeUser(user);
    success({
      user: su,
      jwt: jwt.createToken(su),
    });
  },
  schema: {
    email: {
      required: true,
      type: "string",
    },
    password: {
      required: true,
      type: "string",
    },
  },
});

rootNamespace.addHandler({
  name: "createRole",
  method: async ({ data, success, error }) => {
    try {
      const role = await Role.create({ name: data.name, stringId: data.stringId, color: data.color });
      success({
        role: {
          name: role.name,
          stringId: role.stringId,
          color: role.color,
        },
      });
    } catch (e: any) {
      error(e.message);
    }
  },
  schema: {
    name: {
      required: true,
      type: "string",
    },
    stringId: {
      required: true,
      type: "string",
    },
    color: {
      required: false,
      type: "string",
    },
  },
  rules: {
    auth: true,
    admin: true
  },
});

rootNamespace.addHandler({
  name: "assignRole",
  method: async ({ data, success, error }) => {
    const target = await User.findByPk(data.userId);
    if (!target) {
      error("User not found");
      return;
    }

    const role = await Role.findOne({ where: { stringId: data.roleId } });
    if (!role) {
      error("Role not found");
      return;
    }

    await target.addRole(role);
    success();
  },
  schema: {
    userId: {
      required: true,
      type: "number",
    },
    roleId: {
      required: true,
      type: "string",
    },
  },
  rules: {
    auth: true,
    admin: true
  },
});

rootNamespace.addHandler({
  name: "getUser",
  method: async ({ data, success, error }) => {
    const user = await User.findByPk(data.id);
    if (!user) {
      error("User not found");
      return;
    }

    success(safeUser(user));
  },
  schema: {
    id: {
      required: true,
      type: "number",
    },
  },
  rules: {
    auth: true,
  },
});

rootNamespace.addHandler({
  name: "updateMe",
  method: async ({ data, success, error, user }) => {
    if (!user) {
      error("Unauthorized");
      return;
    }

    const updated = await user.update(data);
    success(safeUser(updated));
  },
  schema: {
    username: {
      required: false,
      type: "string",
    },
    email: {
      required: false,
      type: "string",
    },
    color: {
      required: false,
      type: "string",
    },
  },
})

/**
 * Closes the server and the HTTP server.
 */
export function close() {
  return new Promise<void>((resolve) => {
    io.close(() => {
      httpServer.close(() => {
        resolve();
      });
    });
  });
}

/**
 * Starts the HTTP server on the given port.
 */
async function listen(port: number) {
  return httpServer.listen(port, () => {
    logger.log("Server listening on port " + port + " :rocket:");
  });
}

/**
 * Holder of all server-related methods, primarily for the socket server.
 */
export default {
  listen,
  close,
  io,
  httpServer,
  authenticateSocket,
};
