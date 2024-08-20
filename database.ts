import { Sequelize } from "sequelize";
import logger from "./logger";

/***
 * The Sequelize instance used to interact with the database.
 */
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: (sql, timing) => {
    // logger.debug(sql);
  },
});

export default sequelize;
