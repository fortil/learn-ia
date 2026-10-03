// Language-independent metadata for the /fomo sections: colors, media files,
// chart values and chapter timings. All strings live in i18n `fomo.*`.
// Pattern follows sections/mitos/mythsData.ts.

/** Media root for the fomo page. Not "/fomo/" on purpose: it would collide
 *  with the /fomo route in OSS and in the dev server. */
export const FOMO_MEDIA = '/media/fomo';

/**
 * Section videos. null until F5 finishes postproduction (the page ships with
 * placeholders). Final names: fomo-{0..5}.v{N}.mp4 + poster .jpg, listed in
 * public/media/fomo/media.manifest.json.
 */
export const SECTION_VIDEOS: ReadonlyArray<{ src: string | null; poster: string | null }> = [
  { src: null, poster: null }, // fomo-0 · El rival no existía
  { src: null, poster: null }, // fomo-1 · Hábito 1
  { src: null, poster: null }, // fomo-2 · Hábito 2
  { src: null, poster: null }, // fomo-3 · Hábito 3
  { src: null, poster: null }, // fomo-4 · Hábito 4
  { src: null, poster: null }, // fomo-5 · Hábito 5
];

export type TipInteraction = 'flip3' | 'checklist' | 'flip1' | 'chapters' | 'bars';

export interface BarDatum {
  /** 0..100, width of the bar */
  pct: number;
}

export interface TipMeta {
  /** 1-based habit number; i18n keys are fomo.tips.t{n}.* */
  n: number;
  anchor: string;
  /** tailwind classes for the habit accent (sticker bg) */
  stickerClass: string;
  barClass: string;
  interaction: TipInteraction;
  /** G1 (t4) and G4 (t5): two bars drawn on entry */
  bars?: readonly BarDatum[];
}

export const TIPS: readonly TipMeta[] = [
  {
    n: 1,
    anchor: 'habito-1',
    stickerClass: 'bg-coral text-white',
    barClass: 'bg-coral',
    interaction: 'flip3',
  },
  {
    n: 2,
    anchor: 'habito-2',
    stickerClass: 'bg-teal text-white',
    barClass: 'bg-teal',
    interaction: 'checklist',
  },
  {
    n: 3,
    anchor: 'habito-3',
    stickerClass: 'bg-sun text-ink',
    barClass: 'bg-sun',
    interaction: 'flip1',
  },
  {
    n: 4,
    anchor: 'habito-4',
    stickerClass: 'bg-lilac text-white',
    barClass: 'bg-lilac',
    interaction: 'chapters',
    // both G1 values are percentages on the same 0-100 scale on purpose:
    // the visual contrast is the argument
    bars: [
      { pct: 71 },
      { pct: 4.1 },
    ],
  },
  {
    n: 5,
    anchor: 'habito-5',
    stickerClass: 'bg-pink text-ink',
    barClass: 'bg-pink',
    interaction: 'bars',
    // ~2.5 / ~5 years on a 0-5 scale
    bars: [
      { pct: 50 },
      { pct: 100 },
    ],
  },
];

/**
 * Habit 4 chapters, in seconds inside fomo-4.v1.mp4. Provisional until the
 * final cut timings land in F5: intro puppet ~3 s, then four blocks of
 * ~0.8 s vignette + ~2.7 s real clip.
 */
export const H4_CHAPTER_STARTS: readonly number[] = [3, 6.5, 10, 13.5];

/** WEF Future of Jobs 2025 (G2, "Para profundizar"). */
export const G2_JOBS_2030 = {
  created: 170,
  displaced: 92,
  net: 78,
} as const;

/** layoffs.fyi tracker series (G3, "Para profundizar"). */
export const G3_LAYOFFS: readonly { year: number; k: number; peak?: boolean }[] = [
  { year: 2022, k: 165 },
  { year: 2023, k: 263, peak: true },
  { year: 2024, k: 153 },
  { year: 2025, k: 122 },
  { year: 2026, k: 126 },
];

/** Source links for the "Fuentes" accordion panel, paired with
 *  fomo.profundizar.s{1..17} labels. */
export const SOURCE_LINKS: readonly { key: string; url: string }[] = [
  { key: 's1', url: 'https://www.pewresearch.org/short-reads/2026/08/18/young-adults-in-the-us-are-increasingly-wary-of-ai-concerned-it-will-take-jobs/' },
  { key: 's2', url: 'https://www.bls.gov/news.release/empsit.nr0.htm' },
  { key: 's3', url: 'https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025' },
  { key: 's4', url: 'https://ahrefs.com/blog/ai-marketing-statistics' },
  {
    key: 's5',
    url: 'https://www.ftc.gov/news-events/news/press-releases/20240925-ftc-announces-crackdown-deceptive-ai-claims-schemes',
  },
  {
    key: 's6',
    url: 'https://mitsloan.mit.edu/ideas-made-to-matter/how-artificial-intelligence-impacts-us-labor-market',
  },
  { key: 's7', url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/' },
  { key: 's8', url: 'https://layoffs.fyi' },
  {
    key: 's9',
    url: 'https://www.ibm.com/thought-leadership/institute-business-value',
  },
  { key: 's10', url: 'https://www.britannica.com/topic/Luddite' },
  { key: 's11', url: 'https://www.legislation.gov.uk/ukpga/Vict/28-29/83/contents' },
  {
    key: 's12',
    url: 'https://www.nytimes.com/2023/05/03/opinion/lina-khan-ai-regulation.html',
  },
  {
    key: 's13',
    url: 'https://www.cnbc.com/2022/01/13/european-carriers-are-flying-near-empty-planes-this-winter-to-keep-airport-slots.html',
  },
  {
    key: 's14',
    url: 'https://www.scientificamerican.com/article/did-openai-solve-the-wrong-navier-stokes-problem/',
  },
  { key: 's15', url: 'https://openai.com/index/navier-stokes-solution/' },
  { key: 's16', url: 'https://www.youtube.com/watch?v=4JkWBJICHcc' },
  { key: 's17', url: 'https://apnews.com' },
];
