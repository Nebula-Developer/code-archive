import sequelize from "./database";
import User from "./models/User";
import Place from "./models/Place";
import PlaceGame from "./placeGameManager";
import server from "./server";
import logger from "./logger";
import { configDotenv } from "dotenv";
configDotenv();

const PORT = (process.env.PORT || 3000) as number;
const FORCE = process.env.FORCE === "true";

logger.info(`Starting server on port ${PORT} with force=${FORCE}`);

sequelize.sync({ force: FORCE }).then(async () => {
  await User.sync({ force: FORCE });
  await Place.sync({ force: FORCE });

  PlaceGame.load();
  server.listen(PORT);
});
