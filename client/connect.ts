import { io } from "socket.io-client";
import { createInterface } from "readline";
import { configDotenv } from "dotenv";
import logger from "../logger";

configDotenv({
  path: __dirname + "/../.env",
});

console.log("\x1Bc\x1B[2J");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = io("http://localhost:" + process.env.PORT, {
  reconnection: false,
});

socket.connect();

function setAuth(jwt: string) {
  socket.disconnect();
  socket.auth = {
    jwt,
  };
  socket.connect();
}

socket.emit(
  "register",
  {
    username: "test",
    password: "test",
    email: "time" + new Date().getTime() + "@test.com",
  },
  (res) => {
    if (res.success) {
      socket.emit(
        "login",
        { email: res.data.user.email, password: "test" },
        (res) => {
          if (res.success) {
            setAuth(res.data.jwt);
          } else {
            logger.error(res);
          }
        }
      );
    }
  }
);

socket.on("auth", (res) => {
  socket.emit("say", { message: "Hello, world!" }, (res) => {
    logger.info(res);
  });
});
