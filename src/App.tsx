import { useEffect, useRef } from "react";
import SigninForm from "./components/SigninForm";
import { $user, $userState, logout } from "./state/userStore";
import { useStore } from "@nanostores/react";
import { account } from "./lib/appwrite";
import { Button } from "./components/ui/button";
import { m } from "motion/react";
import { $sidebar } from "./state/sidebarStore";
import { cn, easings } from "./lib/utils";
import { Sidebar } from "./components/Sidebar";
import { BlurryCanvas } from "./components/BlurryCanvas";

const App = () => {
  const state = useStore($userState);
  const sidebar = useStore($sidebar);

  useEffect(() => {
    if (state === "loading") {
      (async () => {
        var user = null;
        try {
          user = await account.get();
        } catch (e) {
          console.error("Error fetching user:", e);
        }

        $user.set(user);
        $userState.set(user ? "loggedIn" : "none");
      })();
    }
  }, [state]);

  useEffect(() => {
    $userState.set("loading");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "d") {
        $sidebar.set(!$sidebar.get());
        console.log("Sidebar toggled:", $sidebar.get());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={cn(
        sidebar ? "bg-black/50" : "",
        "w-full h-full transition-colors duration-300 relative"
      )}
    >
      <BlurryCanvas
        className={cn(
          "absolute top-0 left-0 w-full h-full transition-opacity duration-1000",
          sidebar ? "opacity-20" : "opacity-0"
        )}
        onClick={() => {
          (window as any).ipcRenderer?.send("sidebar", false);
          $sidebar.set(false);
        }}
      />
      <Sidebar open={sidebar} />
    </div>
  );
};

export default App;
