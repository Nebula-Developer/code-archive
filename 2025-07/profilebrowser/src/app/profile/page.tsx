"use client";

import { ProfileForm, profileSchema } from "@/components/ProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { redirect } from "next/navigation";
import { useState } from "react";
import z from "zod";


export default function ProfilePage() {
  const { user, update } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) redirect("/login");

  async function updateAccount(data: z.infer<typeof profileSchema>) {
    setLoading(true);
    try {
      setError("");
      await update({
        email: data.email,
        password: data.password,
        name: data.username,
        oldPassword: data.currentPassword,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      if (msg.toLowerCase().includes("invalid credentials"))
        setError("Invalid current password. Please try again.");
      else
        setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center mt-4 xs:mt-24">
      <Card className="max-w-md w-full not-xs:shadow-none not-xs:border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {user.name || user.email}
          </CardTitle>
          <CardDescription>{user.$id}</CardDescription>
        </CardHeader>

        <CardContent>
          <ProfileForm
            onSubmit={updateAccount}
            loading={loading}
            error={error}
            email={user.email || ""}
            username={user.name || ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
