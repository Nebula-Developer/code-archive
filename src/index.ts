import database from "./database";
import User from "./models/User";
import PlaceGame from "./placeGameManager";
import server from "./server";
import logger from "./logger";
import "./chatappListeners";
import { configDotenv } from "dotenv";
import env from "./env";
import hashing from "./hashing";
configDotenv();

const PORT = env("PORT", 3000);
const FORCE = env("FORCE", false);

const ADMIN_PASSWORD = env("ADMIN_PASSWORD", "admin123");

logger.debug(
  `:sparkle: Starting server on port ${PORT} with force=${FORCE} :sparkle:`
);

database.sync({ force: FORCE }).then(async () => {
  // find the user named "admin", otherwise create.
  let admin = await User.findOne({
    where: { email: "admin@admin.com" },
    attributes: ["id", "password"],
  });

  if (!admin) {
    logger.debug("Admin user not found, creating...");
    admin = await User.create({
      email: "admin@admin.com",
      username: "Administrator",
      password: await hashing.hash(ADMIN_PASSWORD),
    });
  } else if (!(await hashing.compare(ADMIN_PASSWORD, admin.password))) {
    logger.debug("Admin password is incorrect, updating...");
    admin.password = await hashing.hash(ADMIN_PASSWORD);
    await admin.save();
  } else {
    logger.debug("Admin user found.");
  }

  PlaceGame.load();
  server.listen(PORT);
});
