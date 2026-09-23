export const DOODLE_COLORS = {
  coral: '#FF6B4A',
  'coral-deep': '#E04E2D',
  teal: '#14B8A6',
  'teal-deep': '#0F766E',
  sun: '#FFC53D',
  lilac: '#8B5CF6',
  pink: '#F472B6',
  mint: '#D9F2EA',
  peach: '#FFE3D3',
  paper: '#FFF6E9',
  'paper-deep': '#FBEEDB',
  ink: '#26233F',
  'ink-soft': '#5C567A',
} as const;

export type DoodleColor = keyof typeof DOODLE_COLORS;

export function resolveColor(color: DoodleColor | string): string {
  return DOODLE_COLORS[color as DoodleColor] ?? color;
}
