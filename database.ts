import { Sequelize } from "sequelize";
import logger from "./logger";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: (sql, timing) => {
    // logger.info(sql);
  },
});

export default sequelize;
