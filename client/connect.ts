import { io } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger, { attributeObject } from "../src/logger";
import * as fs from "fs";
import env from "../src/env";
import jwt, { JwtPayload } from "jsonwebtoken";

configDotenv({ path: __dirname + "/../.env" });

console.log("\x1Bc\x1B[2J");

const startString = "Global Server Connection Test";
const startBar = String('―').repeat(startString.length);

logger.system(startBar);
logger.system(startString);
logger.system(startBar);

let jwtToken = "";
if (fs.existsSync("jwt.txt")) jwtToken = fs.readFileSync("jwt.txt").toString();

const socket = io("http://localhost:" + env("port", 3030), {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  auth: { jwt: jwtToken },
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

function setAuth(newJwtToken: string) {
  jwtToken = newJwtToken;
  socket.auth = { jwt: jwtToken };
  socket.disconnect().connect();
  logger.log("JWT saved: :password:", jwtToken.substring(0, 20) + "...");
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
    logger.log(":key: Authenticated with server");
    logger.debug("JWT decoded:", attributeObject(jwt.decode(jwtToken) as JwtPayload, null, ["iat", "exp"]));
    logger.debug("Attempting to create group...");

    socket.emit("createGroup", {
      name: "testing-" + new Date().getTime(),
      password: "password",
    }, (res: any) => {
      if (res.success) {
        logger.debug("Group created:", attributeObject(res.data.group, ["id", "name"]));

        socket.emit("sendMessage", {
          groupName: res.data.group.name,
          content: "Hello, world!",
        }, (res: any) => {
          if (res.success) {
            logger.debug("Message sent:", attributeObject(res.data.message, ["id", "content"]));
          } else {
            logger.error("Error sending message: :error:", res.error);
          }
        });
      } else {
        logger.error("Error creating group: :error:", res.error);
      }
    });
  }
});
