import { io } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger from "../src/logger";
import * as fs from "fs";
import env from "../src/env";

configDotenv({ path: __dirname + "/../.env" });

console.log("\x1Bc\x1B[2J");

const startString = "Global Server Connection Test";
const startBar = String('―').repeat(startString.length);

logger.debug(startBar);
logger.debug(startString);
logger.debug(startBar);

let jwt = "";
if (fs.existsSync("jwt.txt")) jwt = fs.readFileSync("jwt.txt").toString();

const socket = io("http://localhost:" + env("port", 3030), {
  autoConnect: true,
  reconnection: false,
  auth: { jwt },
  timeout: 1000,
});

socket.on("connect", () => {
  logger.debug("Connected to server.");
});

socket.on("disconnect", () => {
  logger.debug("Disconnected from server.");
});

socket.on("error", (err) => {
  logger.error("Error:", err);
});

setTimeout(() => {
  if (!socket.connected) {
    logger.debug("Failed to connect to server.");
    process.exit(1);
  }
}, 1000);

socket.onAny((event, ...args) => {
  logger.debug("Event:", event, "Args:", args);
});

function setAuth(jwt: string) {
  socket.auth = { jwt };
  socket.disconnect().connect();
  logger.debug("JWT saved:", jwt);
}

function register() {
  logger.debug("Registering new account with server...");
  socket.emit(
    "register",
    {
      username: "test",
      password: "test",
      email: "time" + new Date().getTime() + "@test.com",
    },
    (res: any) => {
      if (res.success) {
        setAuth(res.data.jwt);
        fs.writeFileSync("jwt.txt", res.data.jwt);
      }
    }
  );
}

socket.on("auth", (res) => {
  if (!res.success) register();
  else {
    logger.debug("Authenticated with server.");
    logger.debug("Attempting to create group...");

    socket.emit("createGroup", {
      name: "testing-" + new Date().getTime(),
      password: "password",
    }, (res: any) => {
      if (res.success) {
        logger.debug("Group created:", res.data.group);

        socket.emit("sendMessage", {
          groupName: res.data.group.name,
          content: "Hello, world!",
        }, (res: any) => {
          if (res.success) {
            logger.debug("Message sent:", res.data.message);
          } else {
            logger.error("Error sending message:", res.error);
          }
        });
      } else {
        logger.error("Error creating group:", res.error);
      }
    });
  }
});
