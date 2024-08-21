import sequelize from "./database";
import User from "./models/User";
import PlaceGame from "./placeGameManager";
import server from "./server";
import logger from "./logger";
import Role from "./models/Role";
import "./chatappListeners";
import { configDotenv } from "dotenv";
configDotenv();

const PORT = (process.env.PORT || 3000) as number;
const FORCE = process.env.FORCE === "true";

logger.debug(`Starting server on port ${PORT} with force=${FORCE}`);

sequelize.sync({ force: FORCE }).then(async () => {
  User.create({
    username: "admin",
    email: "admin@admin.admin",
    password: "admin",
  }).then((user) => {
    Role.create({
      name: "Admin",
      color: "red",
      stringId: "admin",
    }).then((role) => {
      user.addRole(role).then(() => {
        User.findOne({ where: { username: "admin" }}).then((user) => {
          if (user) {
            logger.log("Amount of roles:", user.roles.length);
            logger.error("Got undefined value from logger:", undefined);
          }
        });
      });
    });
  });

  PlaceGame.load();
  server.listen(PORT);
});
