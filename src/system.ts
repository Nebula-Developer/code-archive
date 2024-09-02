import database from "./database";

/**
 * Closes all connections and exits the process.
 */
async function exit() {
  await database.close();
  process.exit(0);
}

export default {
  exit,
};
