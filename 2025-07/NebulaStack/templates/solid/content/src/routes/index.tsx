"use client";

import { createEffect, createResource } from "solid-js";
import { client } from "~/lib/trpc";

export default function Home() {
  createEffect(() => {
    client.query("hello");
  })

  return (
    <main class="p-4">
      <h1 class="text-xl font-bold">SolidStart + tRPC</h1>
      {/* <p>{hello.loading ? "Loading..." : hello()}</p> */}
    </main>
  );
}
