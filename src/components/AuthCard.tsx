"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { useState } from "react";
import { ID } from "appwrite";
import { redirect } from "next/navigation";

import {
  LoginForm,
  loginSchema,
  RegisterForm,
  registerSchema,
} from "./AuthForms";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuth } from "@/lib/AuthContext";

export function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [callLoading, setCallLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading, logout, login } = useAuth();

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setCallLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setCallLoading(false);
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    setCallLoading(true);
    setError("");
    try {
      await account.create(ID.unique(), data.email, data.password, data.name);
      await login(data.email, data.password);
      redirect("/");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      if (msg.includes("already exists"))
        setError("Email is already registered. Please login.");
      else setError(msg);
    } finally {
      setCallLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <Card className="max-w-md w-full not-xs:shadow-none not-xs:border-none">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Please enter your credentials to login."
            : "Create a new account to get started."}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative flex items-center">
        {user && (
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute z-10 backdrop-blur-xs h-full w-full flex items-center justify-center flex-col">
              <p className="text-accent-foreground mb-2">
                You're already logged in as {user.name}.
              </p>
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        )}

        <div
          className={cn(user && "opacity-25 pointer-events-none", "w-full py-4")}
        >
          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              loading={callLoading}
              error={error}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              loading={callLoading}
              error={error}
            />
          )}
        </div>
      </CardContent>

      <CardFooter>
        <p className="mt-4 text-sm text-accent-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button variant="link" onClick={() => setIsLogin((prev) => !prev)}>
            {isLogin ? "Register" : "Login"}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
