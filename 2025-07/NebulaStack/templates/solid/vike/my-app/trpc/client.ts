import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router/_app.js";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
