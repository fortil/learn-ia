#!/usr/bin/env node
// Checks for the /fomo page:
//  1. key parity between src/i18n/es/fomo.ts and src/i18n/en/fomo.ts
//  2. word budgets (web.md §Presupuesto): max 90 words per habit, max 700
//     for the main reading path, both languages
//  3. with --media: every entry of public/media/fomo/media.manifest.json
//     exists and its bytes + sha256 match
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// the i18n modules are plain `export default { ... }` object literals, so they
// import cleanly as ESM once copied to a .mjs file (no eval needed). Wrapped
// under a `fomo` key so key paths match the dot-keys used by useLanguage().
async function loadDict(lang, tmpDir) {
  const src = await readFile(path.join(root, `src/i18n/${lang}/fomo.ts`), 'utf8');
  const tmp = path.join(tmpDir, `${lang}.mjs`);
  await writeFile(tmp, src);
  const dict = (await import(`file://${tmp}`)).default;
  return { fomo: dict };
}

function flatten(dict, prefix = '', out = new Set()) {
  for (const [k, v] of Object.entries(dict)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out.add(key);
    else flatten(v, key, out);
  }
  return out;
}

function get(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? node : node[part]), dict);
}

// a word is any token with a letter or digit; separators like · or % are not
function words(text) {
  return (text.match(/[^\s]+/g) ?? []).filter((w) => /[0-9A-Za-zÀ-ÿ]/.test(w)).length;
}

// keys that make up the main reading path, per web.md counting rules:
// interaction internals (chip lines, card backs, checklist items, the bet),
// the accordion, ui chrome and the nav label do not count
const MAIN_PATH = [
  'fomo.hero.title',
  'fomo.hero.lead',
  'fomo.hero.sticker',
  ...[1, 2, 3, 4, 5].map((n) => `fomo.hero.chip${n}`),
  'fomo.anecdota.heading',
  'fomo.anecdota.p1',
  'fomo.anecdota.p2',
  'fomo.anecdota.p3',
  'fomo.anecdota.video.viendo',
  'fomo.anecdota.video.notar',
  'fomo.fabricantes.heading',
  'fomo.fabricantes.intro',
  ...[1, 2, 3, 4, 5, 6].flatMap((n) => [`fomo.fabricantes.f${n}n`, `fomo.fabricantes.f${n}e`]),
  'fomo.fabricantes.link',
  'fomo.fabricantes.dataChip',
  'fomo.cierre.lead',
  'fomo.cierre.contra',
];

const TIP_KEYS = [
  'kicker',
  'title',
  'idea',
  'p1',
  'p2',
  'dataChip',
  'task',
  'video.viendo',
  'video.notar',
  'b1Label',
  'b1Source',
  'b2Label',
  'b2Source',
  'barsSource',
];
const TIPS = [1, 2, 3, 4, 5].map((n) => `fomo.tips.t${n}`);

let failed = false;
const fail = (msg) => {
  failed = true;
  console.error(`FAIL ${msg}`);
};

const tmpDir = await mkdtemp(path.join(tmpdir(), 'check-fomo-'));
try {
  const [es, en] = await Promise.all([loadDict('es', tmpDir), loadDict('en', tmpDir)]);
  await runChecks(es, en);
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

async function runChecks(es, en) {

// 1. key parity
const esKeys = flatten(es);
const enKeys = flatten(en);
for (const k of esKeys) if (!enKeys.has(k)) fail(`missing in en/fomo.ts: ${k}`);
for (const k of enKeys) if (!esKeys.has(k)) fail(`missing in es/fomo.ts: ${k}`);

// 2. word budgets
const report = [];
for (const [lang, dict] of [['es', es], ['en', en]]) {
  let total = 0;
  for (const key of MAIN_PATH) {
    const v = get(dict, key);
    if (typeof v !== 'string') fail(`${lang}: main-path key not a string: ${key}`);
    else total += words(v);
  }
  for (const tip of TIPS) {
    let tipWords = 0;
    for (const suffix of TIP_KEYS) {
      const v = get(dict, `${tip}.${suffix}`);
      if (typeof v === 'string') tipWords += words(v);
    }
    report.push(`${lang} ${tip}: ${tipWords} words`);
    if (tipWords > 90) fail(`${lang} ${tip} exceeds 90 words (${tipWords})`);
    total += tipWords;
  }
  report.push(`${lang} main path total: ${total} words`);
  if (total > 700) fail(`${lang} main path exceeds 700 words (${total})`);
}
report.forEach((line) => console.log(line));

// 3. media manifest
if (process.argv.includes('--media')) {
  const manifestPath = path.join(root, 'public/media/fomo/media.manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (!Array.isArray(manifest.media) || manifest.media.length === 0) {
    fail('--media: manifest has no entries; fill it in F5');
  }
  for (const entry of manifest.media) {
    const file = path.join(root, 'public/media/fomo', entry.name);
    let size;
    try {
      size = (await stat(file)).size;
    } catch {
      fail(`--media: missing file ${entry.name}`);
      continue;
    }
    if (size !== entry.bytes) fail(`--media: ${entry.name} size ${size} != manifest ${entry.bytes}`);
    const sha256 = createHash('sha256').update(await readFile(file)).digest('hex');
    if (sha256 !== entry.sha256) fail(`--media: ${entry.name} sha256 mismatch`);
  }
  if (!failed) console.log(`media: ${manifest.media.length} files verified`);
}
}

if (failed) process.exit(1);
console.log('check-fomo: OK');
