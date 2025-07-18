import { publicProcedure } from "../trpc";
import * as drizzleQueries from "@db/drizzle/queries/todos";

export const onNewTodo = publicProcedure
  .input((value): string => {
    if (typeof value === "string") return value;
    throw new Error("Input is not a string");
  })
  .mutation(async (opts) => {
    await drizzleQueries.insertTodo(opts.ctx.db, opts.input);
  });
