import { useRef, useEffect } from "react";

export function BlurryCanvas({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
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
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(), // relative
      y: Math.random(), // relative
      vx: (Math.random() - 0.5) * 0.002, // relative per frame
      vy: (Math.random() - 0.5) * 0.002,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      size: Math.random() * 0.4 + 0.1, // relative radius (0–0.15)
    }));

    const updateParticlePosition = (p: any) => {
      p.x += p.vx;
      p.y += p.vy;

      // Efficient boundary check and correction
      if (p.x > 1 || p.x < 0) p.vx *= -1;
      if (p.y > 1 || p.y < 0) p.vy *= -1;

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

        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(0, 0, 100, 100);
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
