import type { Get, UniversalMiddleware } from "@universal-middleware/core";
import { drizzleDB } from "@db/drizzle/db";

declare global {
  namespace Universal {
    interface Context {
      db: typeof drizzleDB;
    }
  }
}

// Add `db` to the Context
export const dbMiddleware: Get<[], UniversalMiddleware> =
  () => async (_request, context, _runtime) => {
    return {
      ...context,
      db: drizzleDB,
    };
  };
