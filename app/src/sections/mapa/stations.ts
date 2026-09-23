import type { DoodleColor } from '@/components/doodle';

/**
 * Shared metadata for the 5 inference stations (colors follow the design).
 * Names are translated: resolve `nameKey` with `t()` from useLanguage().
 */
export const STATION_META: { color: DoodleColor; nameKey: string }[] = [
  { color: 'coral', nameKey: 'mapa.stations.n1' },
  { color: 'sun', nameKey: 'mapa.stations.n2' },
  { color: 'teal', nameKey: 'mapa.stations.n3' },
  { color: 'lilac', nameKey: 'mapa.stations.n4' },
  { color: 'pink', nameKey: 'mapa.stations.n5' },
];
