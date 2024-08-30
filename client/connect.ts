import { io } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger from "../logger";
import * as fs from "fs";
import env from "../env";

configDotenv({ path: __dirname + "/../.env" });

console.log("\x1Bc\x1B[2J");

const startString = "Global Server Connection Test";
const startBar = String('―').repeat(startString.length);

logger.debug(startBar);
logger.debug(startString);
logger.debug(startBar);

let jwt = "";
if (fs.existsSync("jwt.txt")) jwt = fs.readFileSync("jwt.txt").toString();

const socket = io("http://localhost:" + env("port", 3000), {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: Infinity,
  auth: { jwt },
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
