import { io } from "socket.io-client";
import env from "../src/env";
import fs from "fs";
import logger from "../src/logger";

let jwtToken = "";
if (fs.existsSync("jwt.txt")) jwtToken = fs.readFileSync("jwt.txt").toString();

const IO_URL = "http://localhost:" + env("port", 3030);

const IO_CONFIG = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  auth: { jwt: jwtToken },
};

export const socket = io(IO_URL, IO_CONFIG);
export const chatappSocket = io(IO_URL + "/chatapp", IO_CONFIG);

const sockets = [socket, chatappSocket];

export function setAuth(newJwtToken: string) {
  jwtToken = newJwtToken;

  for (const s of sockets) {
    s.auth = { jwt: jwtToken };
    s.disconnect().connect();
  }

  logger.log("JWT saved:", jwtToken.substring(0, 20) + "...");
}
