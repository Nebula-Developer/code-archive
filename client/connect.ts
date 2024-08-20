import { io } from "socket.io-client";
import { createInterface } from "readline";
import { configDotenv } from "dotenv";
import logger from "../logger";
configDotenv({
  path: __dirname + "/../.env",
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = io("http://localhost:" + process.env.PORT, {
  reconnection: false,
});

logger.info("http://localhost:" + process.env.PORT);

socket.connect();

socket.on("connect", () => {
  logger.info("Connected to server");
  socket.emit("say", {

  }, (res) => {
    logger.info(res);
  });
});
