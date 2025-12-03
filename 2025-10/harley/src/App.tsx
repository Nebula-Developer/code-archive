import { createEffect, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import * as Tone from "tone";
import Drum from "./Drum";
import Confetti from "./Confetti";

// responsive container with locked aspect ratio
function ScaledDiv(props: {
  children: JSX.Element;
  class?: string;
  aspectRatio: number;
}) {
  const [scale, setScale] = createSignal(1);
  let ref: HTMLDivElement | undefined;

  const DESIGN_WIDTH = 576;
  const DESIGN_HEIGHT = DESIGN_WIDTH / props.aspectRatio;

  createEffect(() => {
    if (!ref) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const s = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
        setScale(s);
      }
    });
    resizeObserver.observe(ref);
    return () => resizeObserver.disconnect();
  });

  return (
    <div
      ref={ref}
      class={props.class}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        overflow: "hidden",
        position: "relative",
        "-webkit-overflow-scrolling": "auto",
      }}
    >
      <div
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `scale(${scale()}) translate(-50%, -50%)`,
          "transform-origin": "top left",
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

function App() {
  // make all touch events non-passive (ios spam tap fix)
  document.addEventListener("touchstart", () => {}, { passive: false });
  document.addEventListener("touchend", () => {}, { passive: false });

  Tone.setContext(
    new Tone.Context({ latencyHint: "interactive", lookAhead: 0.005 })
  );

  onMount(() => {
    // one-time audio unlock
    const startAudio = () => {
      Tone.start();
      document.removeEventListener("touchstart", startAudio);
      document.removeEventListener("click", startAudio);
    };

    const opts: AddEventListenerOptions = { once: true };
    document.addEventListener("touchstart", startAudio, opts);
    document.addEventListener("click", startAudio, opts);

    // disable zoom/callout behavior
    const css = document.createElement("style");
    css.innerHTML = `
      html, body {
        touch-action: manipulation;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        overscroll-behavior: none;
      }
    `;
    document.head.appendChild(css);
  });

  const [showConfetti, setShowConfetti] = createSignal(false);
  const [confettiTrigger, setConfettiTrigger] = createSignal(0);
  const [overlayText, setOverlayText] = createSignal(false);

  // hit detection: record last hit per drum id with timestamp
  // maintain recent hits (only ids) to match the required roll sequence
  const recentHits: string[] = [];
  const ROLL_PATTERN = [
    "snare",
    "snare",
    "high",
    "high",
    "mid",
    "mid",
    "floor",
    "floor",
    "crash",
  ];

  let overlayTimeout: number | undefined;

  const handleHit = (id?: string) => {
    if (!id) return;
    // push id to recentHits and keep only the last N entries
    recentHits.push(id);
    if (recentHits.length > ROLL_PATTERN.length) recentHits.shift();

    // check if the tail matches the pattern
    if (
      recentHits.length === ROLL_PATTERN.length &&
      recentHits.every((v, i) => v === ROLL_PATTERN[i])
    ) {
      // matched the roll
      setOverlayText(true);
      setShowConfetti(true);
      setConfettiTrigger((t) => t + 1);
      
      if (overlayTimeout) clearTimeout(overlayTimeout);
      overlayTimeout = setTimeout(() => {
        setOverlayText(false);
        overlayTimeout = undefined;
      }, 3000);
      // clear buffer so it won't immediately retrigger
      recentHits.length = 0;
    }
  };

  return (
    <div class="w-full min-h-screen flex flex-col items-center justify-center">
      <div
        class="w-full h-full"
        style={{
          filter: "drop-shadow(-10px 20px 4px rgba(0, 0, 0, 0.5))",
        }}
      >
        <ScaledDiv
          class="relative w-full aspect-video scale-105"
          aspectRatio={16 / 9}
        >
          <Drum
            id="kick"
            image="/assets/images/kick.png"
            sound="/assets/sounds/kick.wav"
            x={250}
            y={160}
            scale={3}
            onHit={handleHit}
          />
          <Drum
            id="snare"
            image="/assets/images/snare.png"
            sound="/assets/sounds/snare.wav"
            x={150}
            y={170}
            scale={1.5}
            onHit={handleHit}
          />
          <Drum
            id="mid"
            image="/assets/images/mid_tom.png"
            sound="/assets/sounds/mid_tom.wav"
            x={295}
            y={90}
            scale={1.6}
            onHit={handleHit}
          />
          <Drum
            id="high"
            image="/assets/images/high_tom.png"
            sound="/assets/sounds/high_tom.wav"
            x={210}
            y={90}
            scale={1.5}
            onHit={handleHit}
          />
          <Drum
            id="floor"
            image="/assets/images/floor_tom.png"
            sound="/assets/sounds/floor_tom.wav"
            x={359}
            y={170}
            scale={2}
            onHit={handleHit}
          />
          <Drum
            id="ride"
            image="/assets/images/ride.png"
            sound="/assets/sounds/ride.wav"
            x={380}
            y={80}
            scale={1.8}
            onHit={handleHit}
          />
          <Drum
            id="crash"
            image="/assets/images/crash.png"
            sound="/assets/sounds/crash.wav"
            x={150}
            y={50}
            scale={2.0}
            onHit={handleHit}
          />
          <Drum
            id="hihat"
            image="/assets/images/hihat.png"
            sound="/assets/sounds/hihat.wav"
            x={100}
            y={150}
            scale={1.6}
            onHit={handleHit}
          />
        </ScaledDiv>
      </div>

      {showConfetti() && (
        <Confetti
          trigger={confettiTrigger()}
          onDone={() => setShowConfetti(false)}
        />
      )}

      <div class="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
        <div
          class={`bg-black/10 backdrop-blur-xl text-white text-shadow-gray-700 text-shadow-lg text-[5vw] font-bold px-6 py-4 rounded-lg transition-opacity duration-500 ${
            overlayText() ? "opacity-100" : "opacity-0"
          }`}
          style={{
            "font-family": "Luckiest Guy, sans-serif",
          }}
        >
          Happy Birthday Harley!
        </div>
      </div>
    </div>
  );
}

export default App;
