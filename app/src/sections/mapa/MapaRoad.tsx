import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ROAD_PATH } from '@/components/doodle';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The continuous dotted road running down the whole /mapa page, drawn with
 * scroll (scrub) with the cochecito riding it. GSAP-only component —
 * no Framer Motion inside (library isolation rule).
 */
export default function MapaRoad() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    const path = pathRef.current;
    const drawn = drawnRef.current;
    if (!path || !drawn) return;
    const len = path.getTotalLength();

    const setProgress = (p: number) => {
      const clamped = Math.min(Math.max(p, 0), 1);
      drawn.style.strokeDasharray = `${len * clamped} ${len}`;
      const pt = path.getPointAtLength(len * clamped);
      if (carRef.current) {
        carRef.current.setAttribute('transform', `translate(${pt.x - 40}, ${pt.y - 28})`);
        carRef.current.style.opacity = clamped > 0.003 ? '1' : '0';
      }
    };

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      setProgress(0.001);
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => setProgress(self.progress),
      });
      return () => st.kill();
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      setProgress(1);
    });
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed bottom-0 left-2 top-[72px] z-[5] hidden lg:block xl:left-6"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 1000" preserveAspectRatio="xMidYMid meet" className="h-full w-auto opacity-60" fill="none">
        {/* faint full road */}
        <path
          ref={pathRef}
          d={ROAD_PATH}
          stroke="#26233F"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="12 14"
          opacity={0.2}
        />
        {/* drawn portion */}
        <path
          ref={drawnRef}
          d={ROAD_PATH}
          stroke="#26233F"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="12 14"
        />
        <g ref={carRef}>
          <image href="/cochecito.svg" width="80" height="54" />
        </g>
      </svg>
    </div>
  );
}
