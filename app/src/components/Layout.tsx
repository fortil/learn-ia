import { useEffect } from 'react';
import { Outlet } from 'react-router';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Shared shell. The Navbar is `sticky` (normal document flow), so the
 * content slot needs no top offset — every page starts right below the nav.
 * Also owns the site-wide Lenis smooth scroll (lerp 0.09).
 */
export default function Layout() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-paper text-ink">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
