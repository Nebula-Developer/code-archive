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
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      i++;

      return {
        x: ((i % sqrt) / sqrt) * range[0],
        y: (Math.floor(i / sqrt) / sqrt) * range[1],
        vx: Math.random() * 0.002 - 0.003,
        vy: Math.random() * 0.002 - 0.003,
        color: `hsl(${(i * 360) / PARTICLE_COUNT}, 100%, 50%)`,
        size: Math.random() * 0.2 + 0.1,
      };
    });

    const updateParticlePosition = (p: any) => {
      p.x += p.vx;
      p.y += p.vy;

      // Efficient boundary check and correction
      if (p.x > range[0] || p.x < 0)
        p.vx = Math.abs(p.vx) * (p.x > range[0] ? -1 : 1);
      if (p.y > range[1] || p.y < 0)
        p.vy = Math.abs(p.vy) * (p.y > range[1] ? -1 : 1);

      p.x = Math.max(0, Math.min(1, p.x));
      p.y = Math.max(0, Math.min(1, p.y));
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update particle positions and draw
      for (const p of particles) {
        updateParticlePosition(p);
        ctx.fillStyle = p.color;
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

    animate();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      className={className}
      style={{
        filter: "blur(300px)",
      }}
      ref={canvasRef}
      onMouseDown={onClick}
    />
  );
}
