/**
 * Tokenizador simulado para "La Cortadora" (Estación 2).
 * Reglas simples y deterministas, pensadas para enseñar (no para ser exactas):
 * - Los signos de puntuación son tokens propios.
 * - Las palabras largas se parten en subpalabras (como "incre" + "íble").
 * - Cada token recibe un "número secreto" estable a partir de su texto.
 */

export interface SimToken {
  /** trozo de texto visible */
  text: string;
  /** número secreto estable (#xxxxx) */
  id: number;
}

const PUNCT = /^[¿?¡!.,;:()"']$/;

/** hash estable para asignar el "número secreto" de cada token */
function hashId(text: string): number {
  let h = 0;
  const lower = text.toLowerCase();
  for (let i = 0; i < lower.length; i += 1) {
    h = (h * 31 + lower.charCodeAt(i)) % 90000;
  }
  return 10000 + h;
}

/** parte una palabra larga en subpalabras de 3-5 letras */
function splitWord(word: string): string[] {
  if (word.length <= 6) return [word];
  const parts: string[] = [];
  let rest = word;
  while (rest.length > 5) {
    const cut = rest.length % 4 === 0 ? 4 : 3;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) parts.push(rest);
  return parts;
}

export function tokenize(input: string): SimToken[] {
  const tokens: SimToken[] = [];
  const chunks = input.trim().split(/\s+/).filter(Boolean);
  for (const chunk of chunks) {
    // separa puntuación pegada al principio / final ("¿Cómo?" → ¿ Cómo ?)
    let leading = '';
    let trailing = '';
    let core = chunk;
    while (core.length > 0 && PUNCT.test(core[0])) {
      leading += core[0];
      core = core.slice(1);
    }
    while (core.length > 0 && PUNCT.test(core[core.length - 1])) {
      trailing = core[core.length - 1] + trailing;
      core = core.slice(0, -1);
    }
    for (const ch of leading) tokens.push({ text: ch, id: hashId(ch) });
    for (const piece of splitWord(core)) {
      if (piece) tokens.push({ text: piece, id: hashId(piece) });
    }
    for (const ch of trailing) tokens.push({ text: ch, id: hashId(ch) });
  }
  return tokens;
}
