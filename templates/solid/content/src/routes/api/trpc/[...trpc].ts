import { createNextApiHandler } from "@trpc/server/adapters/next";
import { z } from "zod";
import { appRouter } from "~/server/trpc/router/_app";

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({} as any),
});