import Database from "better-sqlite3";
import consola from "consola";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";

const sqlite = new Database(process.env.DATABASE_URL, {
  verbose: consola.log,
});

export const drizzleDB = drizzleSqlite(sqlite);
