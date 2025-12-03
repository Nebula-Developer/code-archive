import { initTRPC } from "@trpc/server";
import type { drizzleDB } from "../database/drizzle/db";

const t = initTRPC.context<{ db: typeof drizzleDB }>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
