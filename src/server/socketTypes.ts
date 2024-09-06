import { Socket } from "socket.io";
import User from "../models/User";

/**
 * The response passed to a client from a socket handler
 */
export type SocketHandlerResult = {
  success: boolean;
  data?: any;
  error?: any;
};

/**
 * A callback function that is passed to a socket handler
 */
export type SocketCallback = (res: SocketHandlerResult) => void;

/**
 * The schema for the data types that are expected to be received from the client in a socket handler.
 */
export type DataTypeSchema = {
  [key: string]: { type: string; required: boolean } | string;
};

/**
 * A set of rules that determine how a socket handler should handle or validate the incoming data.
 */
export type SocketHandlerRules = {
  auth?: boolean;
  admin?: boolean;
};

/**
 * The properties that are passed to a socket handler.
 */
export type SocketHandlerProps = {
  /** The data that was received from the client. */
  data: { [key: string]: any };
  /** A callback that should be called when the operation was successful. */
  success: (data?: any) => void;
  /** A callback that should be called when the operation failed. */
  error: (error: string) => void;
  /** The raw callback function that was passed by the client (try to avoid using this). */
  callback: (res?: SocketHandlerResult | any, ...args: any[]) => void;
  /** The socket connection that is being handled. */
  socket: AuthSocket;
  /** The user that is authenticated with the socket connection. */
  user?: User;
};

/**
 * A method for handling a socket event
 */
export type SocketHandlerMethod = (props: SocketHandlerProps) => void;

/**
 * Constructor for producing a socket handler
 */
export type SocketHandler = {
  method: SocketHandlerMethod;
  name: string;
  rules?: SocketHandlerRules;
  schema?: DataTypeSchema;
};

/**
 * A socket with an extended 'User' variable for authentication
 */
export type AuthSocket = Socket & {
  user?: User;
};
