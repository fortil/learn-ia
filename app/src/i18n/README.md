# i18n contract — El Viaje de tu Pregunta

The site is bilingual: **Spanish (`es`, default)** and **English (`en`)**.

## Using translations in a component

```tsx
import { useLanguage } from '@/i18n/useLanguage';

function MySection() {
  const { t, language, setLanguage } = useLanguage();
  return <h2>{t('home.hero.sticker')}</h2>;
}
```

Import paths: hook from `@/i18n/useLanguage`; the `<LanguageProvider>` lives in
`@/i18n/LanguageContext` and only `src/main.tsx` should import it.

- `t(key: string): string` resolves a **dot-key** (`namespace.section.field`).
- Missing key in English → falls back to Spanish. Missing everywhere → returns the raw key.
- `language: 'es' | 'en'`, `setLanguage(lang)` switches and persists to
  `localStorage` (`viaje-lang`) and sets `document.documentElement.lang`.
- The `<LanguageProvider>` already wraps the whole app in `src/main.tsx` — do NOT add another one.

## File structure (one module per namespace per language)

```
src/i18n/
  LanguageContext.tsx   # <LanguageProvider> (do not edit)
  useLanguage.ts        # useLanguage() hook + context (do not edit)
  translations.ts       # merges es/ and en/ dictionaries (do not edit)
  es/
    index.ts            # registers every es namespace module
    common.ts  nav.ts  footer.ts  home.ts
  en/
    index.ts            # registers every en namespace module
    common.ts  nav.ts  footer.ts  home.ts
```

## Adding your page's namespace (page agents)

To avoid merge conflicts, **each page owns exactly two new files** plus one
import line in each `index.ts`:

1. Create `src/i18n/es/<ns>.ts` and `src/i18n/en/<ns>.ts`, each with
   `export default { ... }` (nested objects, string leaves).
2. Register in `src/i18n/es/index.ts` and `src/i18n/en/index.ts`:
   `import <ns> from './<ns>';` and add `<ns>,` to the exported object.

Reserved namespaces (do not touch other pages' namespaces):

| Namespace    | Page / scope                          |
|--------------|---------------------------------------|
| `common`     | shared words (locale, mascot alt, flip hint) — owned by i18n-base |
| `nav`        | Navbar — owned by i18n-base           |
| `footer`     | Footer — owned by i18n-base           |
| `home`       | Home page + `sections/home/**`        |
| `mapa`       | Mapa page + `sections/mapa/**`        |
| `entrenar`   | EntrenamientoVsInferencia page        |
| `ejemplos`   | Ejemplos page                         |
| `mitos`      | Mitos page                            |
| `quiz`       | Quiz page                             |

## Conventions

- **Spanish is the source of truth.** Copy the exact existing Spanish strings
  into `es/<ns>.ts`, then write idiomatic English in `en/<ns>.ts` (same playful
  tone, not literal). Keep **Preguntín** untranslated.
- Keys are camelCase: `home.hero.ctaStart`, `quiz.result.title`.
- **Word-by-word animated titles** are stored as one space-separated string
  and split in the component: `t('home.finalCta.title').split(' ')`.
- **Sentences with inline `<strong>`/links** are stored as parts
  (`...Before` / `...Strong` / `...After` keys) and reassembled in JSX —
  see `src/sections/home/BasicsSection.tsx` or `AnalogiesSection.tsx`.
- **Repeated card/station lists**: either enumerate keys (`s1Title`, `s2Title`…
  like `home.minimap`) or build the array inside the component from `t()` calls
  (see `src/sections/home/BasicsSection.tsx`).
- Number formatting: use `t('common.locale')` as the `toLocaleString` locale.
- Alt texts and aria-labels are translated too (`home.hero.illustrationAlt`,
  `nav.openMenu`, …).
- Shared doodle components (`SpeechBubble`) already translate their own alt
  text via `common.*`; pass translated strings via props from your section.
