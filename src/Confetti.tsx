import { createEffect, onCleanup } from "solid-js";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
};

export default function Confetti(props: { trigger: number; onDone?: () => void }) {
  let canvas: HTMLCanvasElement | undefined;
  let raf = 0;

  const colors = ["#ff4d4f", "#ffc53d", "#73d13d", "#40a9ff", "#9254de"];

  const createParticles = (W: number, H: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 1000; i++) {
      particles.push({
        x: W / 2,
        y: H / 3,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * -8 - 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
      });
    }
    return particles;
  };

  const start = (_trigger?: number) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let W = canvas.width;
    let H = canvas.height;
    const particles = createParticles(W, H);
    let t0 = performance.now();

    const update = (t: number) => {
      const dt = (t - t0) / 1000;
      t0 = t;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.vy += 2.8 * dt;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (particles.every((p) => p.y > H + 20)) {
        props.onDone?.();
        return;
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    const onResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      W = canvas.width;
      H = canvas.height;
    };
    window.addEventListener("resize", onResize);
    onCleanup(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    });
  };

  createEffect(() => {
    // depend on trigger so effect runs every time trigger changes
    start(props.trigger);
  });

  return (
    <canvas
      ref={canvas}
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        "pointer-events": "none",
        "z-index": "9999",
      }}
    />
  );
}
