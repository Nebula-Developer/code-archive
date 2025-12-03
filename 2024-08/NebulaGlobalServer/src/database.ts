import { Sequelize } from "sequelize";
import path from "path";
import fs from "fs";

const dbDir = path.join(__dirname, "..", "database");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

/***
 * The Sequelize instance used to interact with the database.
 */
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(dbDir, "database.sqlite"),
  logging: false,
});

export default sequelize;
