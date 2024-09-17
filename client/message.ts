import { Socket } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger, { measureString } from "../src/logger";
import * as fs from "fs";
import { chatappSocket, setAuth, socket } from "./ioSet";
import { input } from "../src/utils/input";

configDotenv({ path: __dirname + "/../.env" });

const startString = "Global Server Messaging Test :rocket:";
const startBar = String("―").repeat(measureString(startString));

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

async function register() {
  logger.debug("Logging into account...");
  const reg = await input("Register? [y/n]", false);

  if (reg) {
    while (true) {
      const email = await input("Email:");
      const username = await input("Username:");
      const password = await input("Password:");

      try {
        const res = await awaitSocket(socket, "register", {
          email,
          username,
          password,
        });

        setAuth(res.jwt);
        fs.writeFileSync("jwt.txt", res.jwt);
        return;
      } catch (error) {
        logger.error("Failed to register:", error);
      }
    }
  } else {
    while (true) {
      const email = await input("Email:");
      const password = await input("Password:");

      try {
        const res = await awaitSocket(socket, "login", {
          email,
          password,
        });

        setAuth(res.jwt);
        fs.writeFileSync("jwt.txt", res.jwt);
        return;
      } catch (error) {
        logger.error("Failed to login:", error);
      }
    }
  }
}

export async function awaitSocket(
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
async function initiate(): Promise<boolean> {
  if (initLock) return false;
  initLock = true;

  logger.system("Starting initiation process...");

  const join = await input("Join group / create? [*j/c]", "j");
  let curGroup: any | null = null;
  let messages: any[] = [];

  if (join === "j") {
    while (curGroup === null) {
      const groupData = await input("Group to join:");
      const groupPass =
        (await input("Group password (empty for none):", "")) || undefined;
      try {
        const joinRes = await awaitSocket(chatappSocket, "joinGroup", {
          groupName: groupData,
          password: groupPass,
          listen: true,
        });

        curGroup = joinRes.group;
        messages = joinRes.messages;
      } catch (error) {
        logger.error("Failed to join group:", error);
      }
    }

    logger.info("Joined group:", curGroup);
  } else {
    while (curGroup === null) {
      const groupData = await input("Group to create:");
      const groupPass =
        (await input("Group password (empty for none):", "")) || undefined;

      try {
        const createRes = await awaitSocket(chatappSocket, "createGroup", {
          name: groupData,
          password: groupPass,
          listen: true,
        });

        curGroup = createRes.group;
      } catch (error) {
        logger.error("Failed to create group:", error);
      }
    }

    logger.info("Created group:", curGroup);
  }

  logger.info("Listening to group...");

  const logMsg = (msg: any) => {
    logger.info(
      "[" + new Date(msg.createdAt).toLocaleTimeString() + "]",
      msg.user.username + ":",
      msg.content,
    );
  };

  chatappSocket.on("message", (msg) => logMsg(msg));
  messages.forEach(logMsg);

  while (true) {
    const message = await input("Message to send:");

    switch (message) {
      case "/exit":
        return true;
      case "/clear":
        logger.clear();
        break;
      default:
        await awaitSocket(chatappSocket, "sendMessage", {
          groupName: curGroup.name,
          content: message,
        });
        break;
    }
  }

  return true;
}

socket.on("auth", async (res: any) => {
  if (!res.success) return register();

  logger.log(":key: Authenticated with server");

  await new Promise((resolve) => setTimeout(resolve, 100));

  if (await initiate()) {
    logger.system("Initiate method finished :rocket:");
  } else {
    logger.error("Initiate method failed :bomb:");
  }
});
