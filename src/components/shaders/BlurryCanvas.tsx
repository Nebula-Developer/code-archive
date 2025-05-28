import { useRef, useEffect } from "react";

export function BlurryCanvas({
  className,
  onClick,
  range = [0.5, 1],
}: {
  className?: string;
  onClick?: () => void;
  range?: [number, number];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 10;
    const sqrt = Math.sqrt(PARTICLE_COUNT);
    let i = 0;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      i++;

      return {
        x: ((i % sqrt) / sqrt) * range[0],
        y: (Math.floor(i / sqrt) / sqrt) * range[1],
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        color: `hsl(${(i * 360) / PARTICLE_COUNT}, 100%, 50%)`,
        size: Math.random() * 0.2 + 0.1,
      };
    });

    const updateParticlePosition = (p: Particle, dt: number) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Efficient boundary check and correction
      if (p.x > range[0] || p.x < 0)
        p.vx = Math.abs(p.vx) * (p.x > range[0] ? -1 : 1);
      if (p.y > range[1] || p.y < 0)
        p.vy = Math.abs(p.vy) * (p.y > range[1] ? -1 : 1);

      p.x = Math.max(0, Math.min(1, p.x));
      p.y = Math.max(0, Math.min(1, p.y));
    };

    var ot = 0;
    ctx.globalCompositeOperation = "lighter";
    const animate = (t: number) => {
      const dt = (t - ot) / 1000; // Convert to seconds
      ot = t;
      
      ctx.clearRect(0, 0, width, height);

      // Update particle positions and draw
      for (const p of particles) {
        updateParticlePosition(p, dt);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 1000;
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(
          p.x * width,
          p.y * height,
          p.size * Math.min(width, height),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    animate(0);
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      className={className}
      style={{
        // filter: "blur(300px)",
      }}
      ref={canvasRef}
      onMouseDown={onClick}
    />
  );
}
