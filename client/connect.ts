import { Socket } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger, { attributeObject } from "../src/logger";
import * as fs from "fs";
import { chatappSocket, setAuth, socket } from "./ioSet";
import env from "../src/env";

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
  logger.debug("Logging into admin account...");
  socket.emit(
    "login",
    {
      password: env("ADMIN_PASSWORD", "admin123"),
      email: "admin@admin.com"
    },
    (res: any) => {
      if (res.success) {
        setAuth(res.data.jwt);
        fs.writeFileSync("jwt.txt", res.data.jwt);
      }
    }
  );
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

  try {
    const group = (
      await awaitSocket(chatappSocket, "createGroup", {
        name: "testing-" + new Date().getTime(),
        password: "password",
      })
    ).group;

    logger.info("Group created:", attributeObject(group, ["id", "name"]));

    chatappSocket.on("message", (msg) => {
      logger.debug(
        "Message received:",
        attributeObject(msg, ["id", "content"])
      );
    });

    logger.info("Group listened:", await awaitSocket(chatappSocket, "listenGroup", {
      groupName: group.name,
    }));

    logger.info("Message sent:", (await awaitSocket(chatappSocket, "sendMessage", {
      groupName: group.name,
      content: "Test message 1",
    })).message);

    logger.info("Rejoined group:", await awaitSocket(chatappSocket, "joinGroup", {
      groupName: group.name,
      password: "password",
      focus: true
    }));

    const role = await awaitSocket(socket, "createRole", {
      name: "Test Role",
      stringId: "test-" + new Date().getTime(),
      color: "#000000",
    });

    logger.info("Role created:", role);

    logger.info("Role assigned:", await awaitSocket(socket, "assignRole", {
      userId: 1,
      roleId: role.role.stringId,
    }));

    const user = await awaitSocket(socket, "getUser", {
      id: 1,
    });

    logger.info("User found:", user);
  } catch (error) {
    logger.error("Error: :error:", error);
    return false;
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
