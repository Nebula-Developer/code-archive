import { router } from "../trpc";
import { demo } from "./demo";
import { onNewTodo } from "./onNewTodo";

export const appRouter = router({
  demo,
  onNewTodo,
});

export type AppRouter = typeof appRouter;
