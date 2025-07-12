"use client";

import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
