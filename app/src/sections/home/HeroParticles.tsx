import { memo, useEffect, useRef } from 'react';

const COLORS = ['#FF6B4A', '#FFC53D', '#14B8A6', '#8B5CF6', '#F472B6'];
const COUNT = 25;

interface Dot {
  x: number;
  y: number;
  r: number;
  color: string;
  phase: number;
  speed: number;
  dx: number;
  dy: number;
}

/** ~25 sparkles/dots drifting slowly, gently repelled by the cursor. */
const HeroParticles = memo(function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const dots: Dot[] = Array.from({ length: COUNT }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2.5 + Math.random() * 3.5,
      color: COLORS[i % COLORS.length],
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6,
      dx: 0,
      dy: 0,
    }));

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        // gentle drift
        const baseX = d.x + Math.sin(t * d.speed + d.phase) * 14;
        const baseY = d.y + Math.cos(t * d.speed * 0.8 + d.phase) * 18;
        // repel from cursor (separate displacement with lerp decay)
        const mdx = baseX + d.dx - mouse.x;
        const mdy = baseY + d.dy - mouse.y;
        const dist = Math.hypot(mdx, mdy);
        if (dist < 110 && dist > 0.01) {
          const force = ((110 - dist) / 110) * 3.2;
          d.dx += (mdx / dist) * force;
          d.dy += (mdy / dist) * force;
        }
        d.dx *= 0.94;
        d.dy *= 0.94;
        const x = baseX + d.dx;
        const y = baseY + d.dy;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.fillStyle = d.color;
        // sparkle: plus shape for every 5th dot
        if (d.r > 5) {
          ctx.fillRect(x - d.r, y - 1.4, d.r * 2, 2.8);
          ctx.fillRect(x - 1.4, y - d.r, 2.8, d.r * 2);
        } else {
          ctx.arc(x, y, d.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      aria-hidden="true"
    />
  );
});

export default HeroParticles;
