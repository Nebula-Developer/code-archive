"use client";

import { AuthCard } from "@/components/AuthCard";
import { useAuth } from "@/lib/AuthContext";
import { redirect } from "next/navigation";

export default function Login() {
    const { user } = useAuth();

    if (user) redirect("/");
        
    return (
        <div className="flex justify-center mt-4 xs:mt-24">
            <AuthCard />
        </div>
    );
}