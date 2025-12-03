import { todoTable } from "../schema/todos";
import type { drizzleDB } from "../db";

export function insertTodo(db: typeof drizzleDB, text: string) {
  return db.insert(todoTable).values({ text });
}

export function getAllTodos(db: typeof drizzleDB) {
  return db.select().from(todoTable).all();
}
