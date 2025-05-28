import { useEffect } from "react";
import { $user, $userState } from "./state/userStore";
import { useStore } from "@nanostores/react";
import { account } from "./lib/appwrite";
import { $sidebar } from "./state/sidebarStore";
import { cn } from "./lib/utils";
import { Sidebar } from "./components/Sidebar";
import { BlurryCanvas } from "./components/shaders/BlurryCanvas";
import { BlurryCircles } from "./components/shaders/BlurryCircles";
import { HexPatternBackground } from "./components/shaders/HexPatternBackground";
import { FbmColormapShader } from "./components/shaders/ShaderPreview";

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
        sidebar ? "bg-black/50 sidebar-active" : "sidebar-inactive",
        "select-none w-full h-full transition-colors duration-300 relative",
      )}
      id="content"
    >
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out",
          sidebar ? "opacity-100" : "opacity-0"
        )}
        onClick={() => {
          (window as any).ipcRenderer?.send("sidebar", false);
          $sidebar.set(false);
        }}
      >
        <FbmColormapShader className="opacity-20" />
      </div>

      <div className="fixed top-10 left-10 animate-spin bg-red-500 w-10 h-10"></div>

      <Sidebar open={sidebar} />
    </div>
  );
};

export default App;
