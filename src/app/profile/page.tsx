"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const profileSchema = z.object({
  email: z.email("Invalid email address").optional(),
  password: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "Password must be at least 5 characters long",
    }),
  username: z.string().min(1, "Name is required").optional(),
  currentPassword: z.string().min(5, "Please provide your current password"),
});

export function ProfileForm({
  onSubmit,
  loading = false,
  error,
  email = "",
  username = "",
}: {
  onSubmit: (data: z.infer<typeof profileSchema>) => void;
  loading?: boolean;
  error?: string;
  email?: string;
  username?: string;
}) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: email,
      password: "",
      username: username,
      currentPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your new password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your current password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

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
    <div className="flex justify-center mt-4">
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
