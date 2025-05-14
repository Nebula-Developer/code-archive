import { cn, easings } from "@/lib/utils";
import { $user, logout } from "@/state/userStore";
import { useStore } from "@nanostores/react";
import SigninForm from "./SigninForm";
import { Button } from "./ui/button";

export function Sidebar({ open }: { open: boolean }) {
  const user = useStore($user);

  return (
    <div
      className={cn(
        "z-50 absolute right-0 h-full w-1/2 max-w-2xl bg-background border-l",
        open ? "translate-x-0" : "translate-x-full"
      )}
      style={{
        transition: `translate 0.3s ${easings.expoOut}`,
        boxShadow: "0 0 100px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      {user ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-500">You are logged in!</p>

          <Button
            className="mt-5"
            variant="destructive"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="p-24">
          <div className="text-xl mb-6">Welcome</div>

          <SigninForm />
        </div>
      )}
    </div>
  );
}
