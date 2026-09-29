// Conversion blocs legacy (HTML brut, issus de parseContent) → format actuel
// édité dans le CMS : Markdown pour le texte, champs image séparés, colonnes
// typées. Utilisé par les scripts de migration uniquement (pas au build).

import TurndownService from 'turndown';
import { parseContent } from './projekt-blocks.mjs';

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  emDelimiter: '*',
  strongDelimiter: '**',
  br: '\\',
});
turndown.keep(['sup', 'sub']);

export const htmlToMarkdown = (html) =>
  turndown
    .turndown(
      String(html ?? '')
        // <br> en fin de bloc (hérités de WordPress) : sans effet visuel,
        // mais produiraient des « \ » orphelins en Markdown.
        .replace(/(\s*<br\s*\/?>\s*)+(?=<\/(?:p|h\d|li|div|strong|em)>|$)/gi, '')
        .replace(/(<br\s*\/?>\s*){2,}/gi, '<br />'),
    )
    .replace(/\\(?=\n\n|\n?$)/g, '')
    .replace(/^\\$/gm, '')
    .trim();

// Projektdaten : une ligne de Markdown inline par <br /> ou paragraphe.
const inlineMarkdown = (html) =>
  String(html ?? '')
    .split(/<br\s*\/?>|<\/p>\s*<p[^>]*>/i)
    .map((part) => htmlToMarkdown(part).replace(/\s*\n+\s*/g, ' '))
    .filter(Boolean)
    .join('\n');

function modernizeImage(b) {
  const img = { src: b.src, alt: b.alt ?? '', caption: b.figur ? (b.caption ?? '').trim() : '' };
  // Attributs techniques WordPress (champs cachés dans le CMS), valables tant
  // que src === wpSrc.
  img.wpSrc = b.src;
  if (b.breite) img.bildBreite = b.breite;
  if (b.hoehe) img.bildHoehe = b.hoehe;
  if (b.klass) img.klass = b.klass;
  if (b.srcset) { img.srcset = b.srcset; img.sizes = b.sizes ?? ''; }
  return img;
}

function modernizeColumn(c) {
  const breite = String(c.breite);
  const html = c.html ?? '';
  if (!/<img/i.test(html)) return { type: 'text', breite, text: htmlToMarkdown(html) };
  const inner = parseContent(html.trim());
  const imgs = inner.filter((x) => x.type === 'bild');
  if (imgs.length && imgs.length === inner.length) {
    return imgs.length === 1
      ? { type: 'bild', breite, ...modernizeImage(imgs[0]) }
      : { type: 'bilder', breite, bilder: imgs.map(modernizeImage) };
  }
  return { type: 'html', breite, html };
}

export function modernizeBlock(b) {
  switch (b.type) {
    case 'text':
      return { type: 'text', text: htmlToMarkdown(b.html) };
    case 'bild':
      return { type: 'bild', ...modernizeImage(b) };
    case 'spalten':
      return { type: 'spalten', spalten: (b.spalten ?? []).map(modernizeColumn) };
    case 'projektdaten':
      return {
        type: 'projektdaten',
        eintraege: (b.eintraege ?? []).map((e) => ({ label: inlineMarkdown(e.label), wert: inlineMarkdown(e.wert) })),
      };
    case 'mehr_info':
      return { type: 'mehr_info', links: htmlToMarkdown(b.html) };
    default:
      return b;
  }
}

export const modernizeBlocks = (blocks) => (blocks ?? []).map(modernizeBlock);

// Un fichier est au format legacy s'il contient un bloc à HTML brut
// autre que le fallback `html`.
export const isLegacy = (blocks) =>
  (blocks ?? []).some((b) =>
    (b.type === 'text' && 'html' in b) ||
    (b.type === 'mehr_info' && 'html' in b) ||
    (b.type === 'bild' && !('wpSrc' in b) && 'klass' in b) ||
    (b.type === 'spalten' && (b.spalten ?? []).some((c) => !c.type)));
