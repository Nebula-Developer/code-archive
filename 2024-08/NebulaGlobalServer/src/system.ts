import database from "./database";
import server from "./server/server";

/**
 * Closes all connections and exits the process.
 */
async function exit() {
  await server.close();
  await database.close();
  process.exit(0);
}

export default {
  exit,
};
