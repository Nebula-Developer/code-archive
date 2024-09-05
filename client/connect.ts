import { Socket } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger, { attributeObject } from "../src/logger";
import * as fs from "fs";
import { chatappSocket, setAuth, socket } from "./ioSet";

configDotenv({ path: __dirname + "/../.env" });

const startString = "Global Server Connection Test";
const startBar = String("―").repeat(startString.length);

logger.system(startBar);
logger.system(startString);
logger.system(startBar);

socket.on("connect", () => {
  logger.debug("Connected to server.");
});

socket.on("disconnect", () => {
  logger.debug("Disconnected from server.");
});

socket.on("error", (err: any) => {
  logger.error("Error:", err);
});

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
    },
  );
}

async function awaitSocket(
  socket: Socket,
  event: string,
  ...args: any[]
): Promise<any> {
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
      await awaitSocket(chatappSocket, "createGroup", {
        name: "testing-" + new Date().getTime(),
        password: "password",
      })
    ).group;

    logger.debug("Group created:", attributeObject(group, ["id", "name"]));

    const listenGroup = await awaitSocket(chatappSocket, "listenGroup", {
      groupName: group.name,
    });

    logger.debug("Group listened:", listenGroup);

    const message = (
      await awaitSocket(chatappSocket, "sendMessage", {
        groupName: group.name,
        content: "Hello, world!",
      })
    ).message;
    logger.debug("Message sent:", attributeObject(message, ["id", "content"]));
  } catch (error) {
    logger.error("Error: :error:", error);
  }
}

socket.on("auth", async (res: any) => {
  if (!res.success) return register();

  logger.log(":key: Authenticated with server");

  await initiate();
  logger.info("Initiate method finished :rocket:");
});
