import { Sequelize } from "sequelize";

/***
 * The Sequelize instance used to interact with the database.
 */
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false
});

export default sequelize;
