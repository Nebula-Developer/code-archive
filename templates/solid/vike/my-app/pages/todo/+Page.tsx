import type { Data } from "./+data";
import { useData } from "vike-solid/useData";
import { TodoList } from "./TodoList.js";
import { createEffect } from "solid-js";
import { consola } from "consola";

export default function Page() {
  const data = useData<Data>();

  return (
    <>
      <h1>To-do List</h1>
      <TodoList initialTodoItems={data.todo} />
    </>
  );
}
