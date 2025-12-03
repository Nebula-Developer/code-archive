import { publicProcedure } from "../trpc";

export const demo = publicProcedure.query(() => {
  return { demo: true };
});
