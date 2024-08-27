import Link from "next/link";
import { Page } from "./lib/pages";
import React from "react";

export default Page(() => {
  return (
    <main className="h-full flex flex-col items-center justify-center min-h-96">
      <h1 className="text-4xl ">404 Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link href="/" className="text-lg mt-5 text-blue-500 hover:underline">
        Go back to home
      </Link>
    </main>
  );
});
