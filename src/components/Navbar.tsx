"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="w-full not:supports-[backdrop-filter]:bg-background/80 backdrop-blur-md bg-background/50 border-b border-border sticky top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">
          <Link href="/" className="text-foreground hover:text-primary">
            Profile Browser
          </Link>
        </div>
        <nav className="space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                    <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user ? (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/profile">
                        Profile
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/login">
                            Login
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </div>
  );
}
