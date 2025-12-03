import { createSolidAPIHandler } from "solid-start-trpc";
import { createResource } from "solid-js";

import type { inferHandlerInput } from "@trpc/server";
import type { AppRouter } from "../../api/trpc/[trpc]";
import { appRouter } from "~/server/trpc/router/_app";

export const trpc = createSolidAPIHandler<AppRouter>({
  router: appRouter,
  createContext: () => ({} as any),
});