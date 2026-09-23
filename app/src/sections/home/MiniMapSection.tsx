import { useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Map } from 'lucide-react';
import { ROAD_PATH } from '@/components/doodle/PathRoad';
import { useLanguage } from '@/i18n/useLanguage';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Static, language-independent station layout data (text comes from i18n). */
const STATION_META = [
  { n: 1, color: '#FF6B4A', frac: 0.08, side: -1 },
  { n: 2, color: '#FFC53D', frac: 0.28, side: 1 },
  { n: 3, color: '#14B8A6', frac: 0.5, side: -1 },
  { n: 4, color: '#8B5CF6', frac: 0.72, side: 1 },
  { n: 5, color: '#F472B6', frac: 0.92, side: -1 },
] as const;

const MAP_HEIGHT = 560;

/**
 * Scroll-driven preview of the journey: pinned section (180vh), the dotted
 * road draws with scroll and the cochecito rides it station to station.
 * GSAP-only component (no Framer Motion inside — library isolation).
 */
export default function MiniMapSection() {
  const { t } = useLanguage();
  const stations = STATION_META.map((meta) => ({
    ...meta,
    title: t(`home.minimap.s${meta.n}Title`),
    text: t(`home.minimap.s${meta.n}Text`),
  }));
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const path = pathRef.current;
      const drawn = drawnRef.current;
      if (!path || !drawn) return;
      const len = path.getTotalLength();

      // place station dots exactly on the path
      STATION_META.forEach((s, i) => {
        const g = dotRefs.current[i];
        if (!g) return;
        const pt = path.getPointAtLength(len * s.frac);
        g.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
      });

      const setProgress = (p: number) => {
        const clamped = Math.min(Math.max(p, 0), 1);
        drawn.style.strokeDasharray = `${len * clamped} ${len}`;
        const pt = path.getPointAtLength(len * clamped);
        if (carRef.current) {
          carRef.current.setAttribute('transform', `translate(${pt.x - 36}, ${pt.y - 26})`);
          carRef.current.style.opacity = clamped > 0.005 ? '1' : '0';
        }
        STATION_META.forEach((s, i) => {
          const ring = dotRefs.current[i]?.querySelector('.station-ring');
          if (ring) ring.classList.toggle('is-active', clamped >= s.frac && clamped < s.frac + 0.18);
        });
      };

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        setProgress(0.001);
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        gsap.set(cards, { autoAlpha: 0 });
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top top+=80',
            end: '+=180%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            { x: STATION_META[i].side * 60, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.5 },
            i * 0.85,
          );
        });
        // cloud parallax (0.7x)
        tl.to('.minimap-cloud', { y: -60, ease: 'none', duration: cards.length * 0.85 }, 0);
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        setProgress(1);
      });
    },
    { scope: wrapRef },
  );

  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <span className="inline-block -rotate-3 rounded-full border-[3px] border-ink bg-sun px-4 py-1.5 font-mono text-[0.8rem] font-bold uppercase tracking-[0.08em] text-ink shadow-doodle-sm">
            {t('home.minimap.sticker')}
          </span>
          <h2 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
            {t('home.minimap.title')}
          </h2>
          <p className="max-w-xl text-xl font-bold text-ink-soft">
            {t('home.minimap.subtitle')}
          </p>
        </div>
      </div>

      <div ref={wrapRef} className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* doodle clouds (parallax via GSAP) */}
        <svg viewBox="0 0 120 60" className="minimap-cloud pointer-events-none absolute right-[4%] top-6 h-12 w-24 opacity-70" fill="none" aria-hidden="true">
          <path d="M14 46 C 4 46, 2 30, 14 28 C 16 14, 34 8, 46 16 C 54 4, 76 4, 84 16 C 98 10, 114 20, 110 34 C 118 38, 114 46, 104 46 Z" fill="#fff" stroke="#26233F" strokeWidth={3.5} strokeLinejoin="round" />
        </svg>
        <svg viewBox="0 0 120 60" className="minimap-cloud pointer-events-none absolute left-[6%] top-1/3 h-10 w-20 opacity-50" fill="none" aria-hidden="true">
          <path d="M14 46 C 4 46, 2 30, 14 28 C 16 14, 34 8, 46 16 C 54 4, 76 4, 84 16 C 98 10, 114 20, 110 34 C 118 38, 114 46, 104 46 Z" fill="#fff" stroke="#26233F" strokeWidth={3.5} strokeLinejoin="round" />
        </svg>

        <div className="relative" style={{ height: MAP_HEIGHT }}>
          <svg
            viewBox="0 0 200 1000"
            style={{ height: MAP_HEIGHT }}
            className="absolute left-0 w-auto overflow-visible md:left-1/2 md:-translate-x-1/2"
            fill="none"
            aria-hidden="true"
          >
            <path ref={pathRef} d={ROAD_PATH} stroke="#26233F" strokeWidth={5} strokeLinecap="round" strokeDasharray="12 14" opacity={0.22} />
            <path ref={drawnRef} d={ROAD_PATH} stroke="#26233F" strokeWidth={5} strokeLinecap="round" strokeDasharray="12 14" />
            {stations.map((s, i) => (
              <g key={s.n} ref={(el) => { dotRefs.current[i] = el; }}>
                <circle className="station-ring" r={22} fill="none" stroke={s.color} strokeWidth={4} opacity={0} />
                <circle r={17} fill={s.color} stroke="#26233F" strokeWidth={3.5} />
                <text
                  y={6}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={19}
                  fontWeight={800}
                  fontFamily="'Bricolage Grotesque', sans-serif"
                >
                  {s.n}
                </text>
              </g>
            ))}
            <g ref={carRef} opacity={0}>
              <image href="/cochecito.svg" width={72} height={48} />
            </g>
          </svg>

          {stations.map((s, i) => (
            <div
              key={s.n}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`absolute w-[min(78vw,320px)] ${
                s.side === -1
                  ? 'left-24 md:left-auto md:right-[calc(50%+90px)]'
                  : 'left-24 md:left-[calc(50%+90px)]'
              }`}
              style={{ top: `calc(${s.frac * 100}% - 46px)` }}
            >
              <div className="doodle-card doodle-card-hover px-5 py-4">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink font-mono text-xs font-bold text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.n}
                  </span>
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[0.9rem] leading-snug text-ink-soft">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex justify-center px-4">
        <Link
          to="/mapa"
          className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-coral px-8 py-4 font-display text-xl font-extrabold text-white shadow-doodle transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-coral-deep hover:shadow-doodle-pressed"
        >
          <Map className="h-5 w-5" strokeWidth={2.75} />
          {t('home.minimap.cta')}
        </Link>
      </div>
    </section>
  );
}
