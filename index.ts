import sequelize from "./database";
import User from "./models/User";
import Place from "./models/Place";
import PlaceGame from "./placeGameManager";
import server from "./server";
import logger from "./logger";
import { configDotenv } from "dotenv";
import Role from "./models/Role";
configDotenv();

const PORT = (process.env.PORT || 3000) as number;
const FORCE = process.env.FORCE === "true";

logger.log(`Starting server on port ${PORT} with force=${FORCE}`);


sequelize.sync({ force: FORCE }).then(async () => {
  // User.create({
  //   username: "admin",
  //   email: "admin@admin.admin",
  //   password: "admin",
  // }).then((user) => {
  //   Role.create({
  //     name: "admin",
  //     color: "red",
  //   }).then((role) => {
  //     user.addRole(role);
      
  //     User.findOne({ where: { username: "admin" }}).then((user) => {
  //       if (user) {
  //         logger.log(user.roles);
  //       }
  //     });
  //   });
  // });

  PlaceGame.load();
  server.listen(PORT);
});
