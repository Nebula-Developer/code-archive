import { createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import * as Tone from "tone";

// simple global map for shared preloaded buffers
const buffers = new Map<string, Tone.ToneAudioBuffer>();

async function preloadSound(url: string) {
  const existing = buffers.get(url);
  if (existing) return existing;
  const buf = new Tone.ToneAudioBuffer(url);
  await buf.loaded;
  buffers.set(url, buf);
  return buf;
}

export default function Drum({
  id,
  image,
  sound,
  onHit,
  x,
  y,
  scale,
  ...props
}: {
  id?: string;
  image: string;
  sound: string;
  x: number;
  y: number;
  scale?: number;
  onHit?: (id?: string) => void;
} & JSX.IntrinsicElements["div"]) {

  const [pressed, setPressed] = createSignal(false);

  onMount(async () => {
    try {
      await preloadSound(sound);
      console.log("preloaded:", sound);
    } catch (err) {
      console.error("failed to preload:", sound, err);
    }
  });

  const handlePlay = () => {
    setPressed(true);
    const buf = buffers.get(sound);
    if (!buf) return;

    const p = new Tone.Player(buf).toDestination();
    p.start();
    onHit?.(id);

    const duration = buf.duration ?? 1;
    setTimeout(() => {
      try {
        p.dispose();
      } catch {
        /* ignore */
      }
    }, duration * 1000 + 100);
  };

  let timeoutId: number | undefined;
  const handleRelease = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      setPressed(false);
      timeoutId = undefined;
    }, 10);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <div is non-interactive but has interaction handlers
    <div
      {...props}
      class={`absolute top-0 left-0 rounded-full select-none touch-none active:scale-95 ${
        pressed() ? "scale-95" : ""
      }`}
      style={{
        transform: `scale(${scale ?? 1})`,
        "transform-origin": "center",
        left: `${x}px`,
        top: `${y}px`,
      }}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={(e) => {
        e.preventDefault();
        handlePlay();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleRelease();
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        e.preventDefault();
        handlePlay();
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== "mouse") return;
        e.preventDefault();
        handleRelease();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        e.preventDefault();
        handleRelease();
      }}
    >
      <img
        src={image}
        alt="Drum"
        class="h-16 pointer-events-none"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
