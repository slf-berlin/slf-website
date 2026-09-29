// Bibliothèque partagée : contenu projet ⇄ blocs typés.
//
// Les fichiers content/projekte/*.yml stockent une liste de blocs typés
// (`inhalt`), édités dans le CMS avec des widgets « confort » : texte en
// Markdown (éditeur visuel), images via le widget image, colonnes typées
// (Text / Bild / Bilder). serializeBlocks() produit le HTML maison consommé
// par ProjectDetail (classes slf-row / slf-col-NN / slf-daten, figures, imgs).
//
// Historique : la migration WordPress (parseContent) produisait des blocs
// « legacy » contenant du HTML brut ; modernizeBlocks() (html-to-blocks.mjs)
// les convertit au format actuel.

import { marked } from 'marked';

marked.use({ gfm: true, breaks: true });

// ─── Helpers ─────────────────────────────────────────────────────────────────

const escAttr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Liens externes : nouvel onglet, comme les liens WordPress historiques.
const externalLinks = (html) =>
  html.replace(/<a href="(https?:\/\/[^"]*)"/g, '<a href="$1" target="_blank" rel="noopener"');

export function markdownToHtml(md) {
  const src = String(md ?? '').trim();
  if (!src) return '';
  return externalLinks(marked.parse(src).trim());
}

// Projektdaten : Markdown inline (liens, gras) ligne par ligne,
// chaque saut de ligne saisi dans le CMS → <br />.
const inlineLines = (s) =>
  externalLinks(
    String(s ?? '')
      .trim()
      .split(/\r?\n/)
      .map((line) => marked.parseInline(line.trim()))
      .join('<br />'),
  );

// Image (bloc `bild` ou colonne `bild` / élément de `bilder`).
// Les attributs techniques hérités de WordPress (dimensions, srcset, classe)
// ne sont valables que tant que l'image n'a pas été remplacée dans le CMS :
// `wpSrc` mémorise le src d'origine.
function serializeImage(b) {
  const src = b.src ?? '';
  const wp = !!b.wpSrc && b.wpSrc === src;
  let tag = '<img';
  if (wp && b.bildBreite && b.bildHoehe) tag += ` width="${b.bildBreite}" height="${b.bildHoehe}"`;
  tag += ` src="${escAttr(src)}"`;
  if (wp && b.klass) tag += ` class="${b.klass}"`;
  tag += ` alt="${escAttr(b.alt)}"`;
  if (wp && b.srcset) tag += ` srcset="${b.srcset}" sizes="${b.sizes ?? ''}"`;
  tag += ' />';
  const caption = String(b.caption ?? '').trim();
  return caption ? `<figure>${tag}<figcaption>${caption}</figcaption></figure>` : tag;
}

function serializeColumn(c) {
  switch (c.type) {
    case 'text': return markdownToHtml(c.text);
    case 'bild': return c.src ? serializeImage(c) : '';
    case 'bilder': return (c.bilder ?? []).filter((b) => b.src).map(serializeImage).join('\n');
    case 'html': return c.html ?? '';
    default: throw new Error(`Type de colonne inconnu : ${c.type}`);
  }
}

// ─── Sérialisation ───────────────────────────────────────────────────────────

export function serializeBlock(b) {
  switch (b.type) {
    case 'text':
      return markdownToHtml(b.text);
    case 'bild':
      return b.src ? serializeImage(b) : '';
    case 'spalten': {
      const cols = (b.spalten ?? [])
        .map((c) => `<div class="slf-col-${c.breite ?? 50}">${serializeColumn(c)}</div>`)
        .join('');
      return cols ? `<div class="slf-row">${cols}</div>` : '';
    }
    case 'projektdaten': {
      const items = (b.eintraege ?? [])
        .map((e) => `<dt>${inlineLines(e.label)}</dt><dd>${inlineLines(e.wert)}</dd>`)
        .join('');
      return `<p class="slf-daten-heading">Projektdaten</p><dl class="slf-daten">${items}</dl>`;
    }
    case 'mehr_info':
      return `<div class="slf-row"><div class="slf-col-50"><p>Mehr Informationen</p></div><div class="slf-col-50">${markdownToHtml(b.links)}</div></div>`;
    case 'html':
      return b.html ?? '';
    default:
      throw new Error(`Type de bloc inconnu : ${b.type}`);
  }
}

export function serializeBlocks(blocks) {
  if (!blocks || !blocks.length) return null;
  return blocks.map(serializeBlock).filter(Boolean).join('\n');
}

// ─── Format legacy (migration WordPress) ─────────────────────────────────────
// Blocs à HTML brut, reproduisant à l'octet près le HTML de extractLayout().
// Utilisé uniquement par parseContent() (garantie round-trip) ; le résultat
// est ensuite converti au format actuel par modernizeBlocks().

function serializeLegacyImg(b) {
  let tag = `<img width="${b.breite}" height="${b.hoehe}" src="${b.src}" class="${b.klass}" alt="${b.alt ?? ''}"`;
  if (b.srcset) tag += ` srcset="${b.srcset}" sizes="${b.sizes ?? ''}"`;
  tag += ' />';
  return tag;
}

export function serializeLegacyBlock(b) {
  switch (b.type) {
    case 'text': {
      const html = (b.html ?? '').trim() === '' ? '' : b.html;
      if (!html) return '';
      return html.trimStart().startsWith('<')
        ? html
        : `<p style="font-weight: 400;">${html}</p>`;
    }
    case 'bild': {
      const img = serializeLegacyImg(b);
      return b.figur
        ? `<figure>\n ${img} <figcaption>${b.caption ?? ''}</figcaption>\n </figure>`
        : img;
    }
    case 'spalten': {
      const cols = (b.spalten ?? [])
        .map((c) => `<div class="slf-col-${c.breite}">${c.html ?? ''}</div>`)
        .join('');
      return `<div class="slf-row">${cols}</div>`;
    }
    case 'projektdaten': {
      const items = (b.eintraege ?? [])
        .map((e) => `<dt>${e.label}</dt><dd>${e.wert}</dd>`)
        .join('');
      return `<p class="slf-daten-heading">Projektdaten</p><dl class="slf-daten">${items}</dl>`;
    }
    case 'mehr_info':
      return `<div class="slf-row"><div class="slf-col-50"><p>Mehr Informationen</p></div><div class="slf-col-50">${b.html ?? ''}</div></div>`;
    case 'html':
      return b.html ?? '';
    default:
      throw new Error(`Type de bloc inconnu : ${b.type}`);
  }
}

export function serializeLegacyBlocks(blocks) {
  if (!blocks || !blocks.length) return null;
  return blocks.map(serializeLegacyBlock).filter(Boolean).join('\n');
}

// ─── Parsing HTML → blocs legacy (migration) ─────────────────────────────────

const OPENER_ROW = '<div class="slf-row">';
const OPENER_DATEN = '<p class="slf-daten-heading">';
const OPENER_FIGURE = '<figure>';
const OPENER_IMG = '<img ';
const OPENERS = [OPENER_ROW, OPENER_DATEN, OPENER_FIGURE, OPENER_IMG];

// Fin (exclusive) d'un <div …> ouvert à `pos`, en suivant la profondeur.
function divEnd(html, pos) {
  let depth = 1;
  let i = html.indexOf('>', pos) + 1;
  while (i > 0 && i < html.length && depth > 0) {
    const o = html.indexOf('<div', i);
    const c = html.indexOf('</div>', i);
    if (o !== -1 && (c === -1 || o < c)) { depth++; i = o + 4; }
    else if (c !== -1) {
      depth--;
      if (depth === 0) return c + 6;
      i = c + 6;
    } else return -1;
  }
  return -1;
}

const IMG_RE = /^<img width="(\d+)" height="(\d+)" src="([^"]*)" class="([^"]*)" alt="([^"]*)"(?: srcset="([^"]*)" sizes="([^"]*)")? \/>$/;

function parseImgTag(tag) {
  const m = IMG_RE.exec(tag);
  if (!m) return null;
  const b = { type: 'bild', breite: +m[1], hoehe: +m[2], src: m[3], klass: m[4], alt: m[5], figur: false };
  if (m[6] !== undefined) { b.srcset = m[6]; b.sizes = m[7] ?? ''; }
  return b;
}

const FIGURE_RE = /^<figure>\n (<img [^\n]*? \/>) <figcaption>([\s\S]*?)<\/figcaption>\n <\/figure>$/;
const MEHR_INFO_RE = /^<div class="slf-row"><div class="slf-col-50"><p>Mehr Informationen<\/p><\/div><div class="slf-col-50">([\s\S]*)<\/div><\/div>$/;

function parseRowColumns(seg) {
  const inner = seg.slice(OPENER_ROW.length, -'</div>'.length);
  const cols = [];
  let pos = 0;
  while (pos < inner.length) {
    const m = /^<div class="slf-col-(\d+)">/.exec(inner.slice(pos));
    if (!m) return null;
    const end = divEnd(inner, pos);
    if (end === -1) return null;
    cols.push({ breite: +m[1], html: inner.slice(pos + m[0].length, end - 6) });
    pos = end;
  }
  return cols.length ? cols : null;
}

// Tente de lire un élément structurel commençant exactement à `pos`.
// Retourne { block, end } ou null. Le bloc est déjà vérifié round-trip ;
// en cas d'écart il est rétrogradé en bloc `html` (verbatim → round-trip trivial).
function tryStructural(html, pos) {
  let seg = null;
  let block = null;

  if (html.startsWith(OPENER_DATEN, pos)) {
    const close = html.indexOf('</dl>', pos);
    if (close === -1) return null;
    seg = html.slice(pos, close + 5);
    const items = [...seg.matchAll(/<dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd>/g)]
      .map((m) => ({ label: m[1], wert: m[2] }));
    block = { type: 'projektdaten', eintraege: items };
  } else if (html.startsWith(OPENER_ROW, pos)) {
    const end = divEnd(html, pos);
    if (end === -1) return null;
    seg = html.slice(pos, end);
    const mehr = MEHR_INFO_RE.exec(seg);
    if (mehr && !mehr[1].includes('slf-col-')) {
      block = { type: 'mehr_info', html: mehr[1] };
    } else {
      const cols = parseRowColumns(seg);
      block = cols ? { type: 'spalten', spalten: cols } : { type: 'html', html: seg };
    }
  } else if (html.startsWith(OPENER_FIGURE, pos)) {
    const close = html.indexOf('</figure>', pos);
    if (close === -1) return null;
    seg = html.slice(pos, close + 9);
    const m = FIGURE_RE.exec(seg);
    const img = m ? parseImgTag(m[1]) : null;
    block = img ? { ...img, figur: true, caption: m[2] } : { type: 'html', html: seg };
  } else if (html.startsWith(OPENER_IMG, pos)) {
    const close = html.indexOf(' />', pos);
    if (close === -1) return null;
    seg = html.slice(pos, close + 3);
    block = parseImgTag(seg) ?? { type: 'html', html: seg };
  } else {
    return null;
  }

  // Garantie round-trip par bloc : au moindre écart, verbatim.
  if (serializeLegacyBlock(block) !== seg) block = { type: 'html', html: seg };
  return { block, end: pos + seg.length };
}

// Fin d'un run de texte : au prochain '\n' suivi d'un ouvreur structurel.
function findTextEnd(html, pos) {
  let i = pos;
  while (true) {
    const nl = html.indexOf('\n', i);
    if (nl === -1) return html.length;
    if (OPENERS.some((o) => html.startsWith(o, nl + 1))) return nl;
    i = nl + 1;
  }
}

// HTML maison → blocs legacy (round-trip garanti via serializeLegacyBlocks).
export function parseContent(html) {
  if (html == null || html === '') return [];
  const blocks = [];
  let pos = 0;
  while (pos < html.length) {
    const hit = tryStructural(html, pos);
    if (hit && (hit.end >= html.length || html[hit.end] === '\n')) {
      blocks.push(hit.block);
      pos = hit.end < html.length ? hit.end + 1 : hit.end;
    } else {
      // Run de texte (ou anomalie : élément structurel non suivi d'un '\n').
      const end = findTextEnd(html, pos);
      const text = html.slice(pos, end);
      const block = { type: 'text', html: text };
      blocks.push(serializeLegacyBlock(block) === text ? block : { type: 'html', html: text });
      pos = end < html.length ? end + 1 : end;
    }
  }
  return blocks;
}
