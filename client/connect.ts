import { io } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger, { attributeObject } from "../src/logger";
import * as fs from "fs";
import env from "../src/env";
import jwt, { JwtPayload } from "jsonwebtoken";

configDotenv({ path: __dirname + "/../.env" });

console.log("\x1Bc\x1B[2J");

const startString = "Global Server Connection Test";
const startBar = String("―").repeat(startString.length);

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

async function awaitSocket(event: string, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit(event, ...args, (res: any) => {
      if (res.success) {
        resolve(res.data);
      } else {
        reject(res.error);
      }
    });
  });
}

let initLock = false;
async function initiate() {
  if (initLock) return;
  initLock = true;

  logger.debug("Attempting to create group...");

  try {
    const group = (
      await awaitSocket("createGroup", {
        name: "testing-" + new Date().getTime(),
        password: "password",
      })
    ).group;

    logger.debug("Group created:", attributeObject(group, ["id", "name"]));

    const message = (
      await awaitSocket("sendMessage", {
        groupName: group.name,
        content: "Hello, world!",
      })
    ).message;
    logger.debug("Message sent:", attributeObject(message, ["id", "content"]));
  } catch (error) {
    logger.error("Error: :error:", error);
  }
}

socket.on("auth", async (res) => {
  if (!res.success) return register();

  logger.log(":key: Authenticated with server");
  logger.debug(
    "JWT decoded:",
    attributeObject(jwt.decode(jwtToken) as JwtPayload, null, ["iat", "exp"])
  );

  await initiate();
  logger.info("Initiate method finished :rocket:");
});
