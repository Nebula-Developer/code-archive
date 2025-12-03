import type { drizzleDB } from "./database/drizzle/db";
import type { Session } from "@auth/core/types";

declare global {
  namespace Vike {
    interface PageContext {
      session?: Session | null;
    }
  }
}

declare global {
  namespace Vike {
    interface PageContext {
      db: ReturnType<typeof drizzleDB>;
    }
  }
}

// biome-ignore lint/complexity/noUselessEmptyExport: ensure that the file is considered as a module
export {};
