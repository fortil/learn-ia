import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';
import { resolveColor, type DoodleColor } from './colors';

/** The shared serpentine road (200 x 1000 viewBox space). */
export const ROAD_PATH =
  'M100 20 C 190 90, 20 170, 100 240 C 180 310, 20 390, 100 460 C 180 530, 20 610, 100 680 C 165 735, 60 800, 100 860 C 130 905, 100 940, 100 980';

export interface PathRoadHandle {
  /** position the car at progress 0..1 (called from GSAP scrub) */
  setProgress: (p: number) => void;
  path: SVGPathElement | null;
}

interface PathRoadProps {
  /** initial progress 0..1 */
  progress?: number;
  showCar?: boolean;
  color?: DoodleColor | string;
  className?: string;
  height?: number;
}

/**
 * The dotted road SVG that snakes down the page, with the cochecito riding it.
 * Exposes an imperative `setProgress` so scroll scrubs (GSAP) can drive the
 * drawn portion + car position without re-rendering React.
 */
const PathRoad = forwardRef<PathRoadHandle, PathRoadProps>(function PathRoad(
  { progress = 1, showCar = true, color = 'ink', className, height = 1000 },
  ref,
) {
  const pathRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);

  const apply = (p: number) => {
    const clamped = Math.min(Math.max(p, 0), 1);
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    if (drawnRef.current) {
      drawnRef.current.style.strokeDasharray = `${len * clamped} ${len}`;
    }
    if (carRef.current && showCar) {
      const pt = path.getPointAtLength(len * clamped);
      carRef.current.setAttribute(
        'transform',
        `translate(${pt.x - 42}, ${pt.y - 30})`,
      );
      carRef.current.style.opacity = clamped > 0.005 ? '1' : '0';
    }
  };

  useImperativeHandle(ref, () => ({
    setProgress: apply,
    path: pathRef.current,
  }));

  useEffect(() => {
    apply(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, showCar]);

  const stroke = resolveColor(color);
  return (
    <svg
      viewBox="0 0 200 1000"
      style={{ height }}
      className={cn('w-auto overflow-visible', className)}
      fill="none"
      aria-hidden="true"
    >
      {/* faint full road */}
      <path
        ref={pathRef}
        d={ROAD_PATH}
        stroke={stroke}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="12 14"
        opacity={0.22}
      />
      {/* drawn portion (driven imperatively) */}
      <path
        ref={drawnRef}
        d={ROAD_PATH}
        stroke={stroke}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="12 14"
      />
      {showCar && (
        <g ref={carRef}>
          <image href="/cochecito.svg" width="84" height="56" />
        </g>
      )}
    </svg>
  );
});

export default PathRoad;
