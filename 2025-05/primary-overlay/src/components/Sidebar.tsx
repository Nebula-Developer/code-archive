import { cn, easings } from "@/lib/utils";
import { $user, logout } from "@/state/userStore";
import { useStore } from "@nanostores/react";
import SigninForm from "./SigninForm";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

export type Side = "top" | "bottom" | "left" | "right";

export function Sidebar({ open }: { open: boolean }) {
  const user = useStore($user);

  const [size, setRawSize] = useState(0);
  const [panelSide, setPanelSide] = useState<Side>("right");

  const limiter: () => number = () =>
    panelSide === "left" || panelSide === "right"
      ? document.documentElement.clientWidth
      : document.documentElement.clientHeight;

  function setSize(newSize: number) {
    var lim = limiter();
    var low = lim / 10;
    var high = lim * 0.8;
    if (newSize < low) newSize = low;
    if (newSize > high) newSize = high;
    setRawSize(newSize);
  }

  useEffect(() => {
    setSize(limiter() / 3);
  }, [panelSide]);

  let sizeAttribute =
    panelSide === "top" || panelSide === "bottom" ? "height" : "width";

  let sizing = "h-full";
  if (panelSide === "top" || panelSide === "bottom") sizing = "w-full";

  let grabber = "";

  switch (panelSide) {
    case "right":
      break;
    case "bottom":
      break;
  }

  let position = open ? "translate-x-0" : "translate-x-full";
  switch (panelSide) {
    case "left":
      grabber = "right-0 top-0 h-full w-1";
      position = open ? "translate-x-0" : "-translate-x-full";
      break;
    case "right":
      grabber = "left-0 top-0 h-full w-1";
      sizing += " right-0";
      position = open ? "translate-x-0" : "translate-x-full";
      break;
    case "top":
      grabber = "left-0 bottom-0 w-full h-1";
      position = open ? "translate-y-0" : "-translate-y-full";
      break;
    case "bottom":
      grabber = "left-0 top-0 w-full h-1";
      sizing += " bottom-0";
      position = open ? "translate-y-0" : "translate-y-full";
      break;
  }

  var startGrabPos = 0;
  var grabberRef = useRef<HTMLDivElement>(null);

  var [grabbing, setGrabbing] = useState(false);

  return (
    <div
      className={cn("z-50 absolute bg-background border-l", sizing, position)}
      style={{
        transition: `translate 0.3s ${easings.expoOut}`,
        boxShadow: "0 0 100px 30px rgba(0, 0, 0, 0.5)",
        [sizeAttribute]: size + "px",
      }}
    >
      <div className="relative w-full h-full">
        <div className="overflow-y-scroll w-full max-h-full h-fit">
          {user ? (
            <div className="py-12 flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
              <p className="text-gray-500">You are logged in!</p>

              <Button
                className="mt-5"
                variant="destructive"
                onClick={() => logout()}
              >
                Logout
              </Button>

              {/* buttons to change size */}
              <Button className="mt-5" onClick={() => setPanelSide("left")}>
                Left
              </Button>

              <Button className="mt-5" onClick={() => setPanelSide("right")}>
                Right
              </Button>

              <Button className="mt-5" onClick={() => setPanelSide("top")}>
                Top
              </Button>

              <Button className="mt-5" onClick={() => setPanelSide("bottom")}>
                Bottom
              </Button>
            </div>
          ) : (
            <div className="p-24">
              <div className="text-xl mb-6">Welcome</div>

              <SigninForm />
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute transition-colors",
            grabbing
              ? "bg-accent-foreground"
              : "bg-accent hover:bg-foreground/50",
            grabber,
            panelSide === "left" || panelSide === "right"
              ? "cursor-ew-resize"
              : "cursor-ns-resize"
          )}
          ref={grabberRef}
          onMouseDown={(e) => {
            setGrabbing(true);
            let mouseMove = (event: MouseEvent) => {
              if (panelSide === "left" || panelSide === "right") {
                const delta = event.clientX - startGrabPos;
                if (panelSide === "right") setSize(size - delta);
                else setSize(size + delta);
              } else {
                const delta = event.clientY - startGrabPos;
                if (panelSide === "bottom") setSize(size - delta);
                else setSize(size + delta);
              }
            };

            startGrabPos =
              panelSide === "left" || panelSide === "right"
                ? e.clientX
                : e.clientY;
            document.addEventListener("mousemove", mouseMove);

            const className =
              panelSide === "left" || panelSide === "right"
                ? "cursor-lock-ew"
                : "cursor-lock-ns";

            document.body.classList.add(className);

            document.addEventListener("mouseup", () => {
              document.body.classList.remove("cursor-lock-ew");
              document.body.classList.remove("cursor-lock-ns");

              document.removeEventListener("mousemove", mouseMove);
              setGrabbing(false);
            });
          }}
          onDragStart={(_) => false}
        ></div>

        <div className="cursor-pointer absolute bottom-5 right-5 w-10 h-10 bg-muted hover:bg-accent shadow-xl rounded-sm flex items-center justify-center"
          onClick={() => {
            setSize(limiter() / 3);
          }}
        >
          <div className="text-xs">
            Reset
          </div>
        </div>
      </div>
    </div>
  );
}
