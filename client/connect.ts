import { io } from "socket.io-client";
import { configDotenv } from "dotenv";
import logger from "../logger";
import fs from "fs";

configDotenv({ path: __dirname + "/../.env" });

console.log("\x1Bc\x1B[2J");

var jwt = "";
if (fs.existsSync("jwt.txt")) jwt = fs.readFileSync("jwt.txt").toString();

const socket = io("http://localhost:" + process.env.PORT, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: Infinity,
  auth: { jwt },
});

function setAuth(jwt: string) {
  socket.auth = { jwt };
  socket.disconnect().connect();
}

function register() {
  socket.emit(
    "register",
    {
      username: "test",
      password: "test",
      email: "time" + new Date().getTime() + "@test.com",
    },
    (res) => {
      if (res.success) {
        setAuth(res.data.jwt);
        fs.writeFileSync("jwt.txt", res.data.jwt);
      }
    }
  );
}

if (!jwt) register();

socket.on("auth", (res) => {
  if (!res.success) register();
  else logger.log(res)
});
