"use client";

import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex justify-center mt-4 xs:mt-24">
      <h1 className="text-2xl font-bold">
        Welcome to Profile Browser
        {user ? `, ${user.name || user.email}` : ""}
      </h1>
    </div>
  );
}
