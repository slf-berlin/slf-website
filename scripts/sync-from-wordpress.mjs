#!/usr/bin/env node
// ⚠️ NE PAS ÉDITER — généré automatiquement, lancé via `npm run sync` ou `npm run build`.

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WP_BASE = 'https://www.slf-berlin.de/wp-json/wp/v2';
// ⚠️ DEPUIS LA MIGRATION CMS : src/data/projects.js est généré depuis
// content/projekte/ (build-projects-from-content.mjs). Ce script ne sert plus
// que de snapshot de secours de WordPress — il écrit dans backup/, jamais dans
// src/data/, et ne peut donc pas écraser le contenu édité via le CMS.
const OUTPUT_PATH = join(__dirname, '../backup/projects-wp-snapshot.js');

const KNOWN_SLUGS = new Set([
  'entwicklungskonzepte',
  'wettbewerbe',
  'bauleitplanung',
  'verfahrensbetreuung',
]);

// Maps WP category slug → display label used by FILTER_FN in filters.js.
// The WP slugs are historical; the site now presents Entwicklungskonzepte as
// "Stadt- und Quartiersentwicklung" and merges Wettbewerbe into "Städtebau".
const CATEGORY_LABEL = {
  entwicklungskonzepte: 'Stadt- und Quartiersentwicklung',
  wettbewerbe: 'Städtebau',
  bauleitplanung: 'Bauleitplanung',
  verfahrensbetreuung: 'Verfahrensbetreuung',
};

// Maps gendered Projektdaten labels coming from WordPress to gender-neutral
// forms. Applied to <dt> labels at sync time so projects.js is always neutral,
// regardless of what the WP editors typed. Keep the keys in sync with the
// extractDaten() lookups in src/pages/Projekte.jsx.
const LABEL_NEUTRAL = {
  'Auftraggeber': 'Auftraggebende',
};

// Fallback values keyed by WP slug, used ONLY when auto-extraction yields
// nothing. WordPress stays the source of truth (so a value updated in WP wins);
// these just guarantee a known-correct value survives a transient fetch failure
// for projects whose prize lives only in the theme title, not the Verfahren field.
const FALLBACKS = {
  // Leipzig won 1. Preis (in the page <h3> title, absent from the Verfahren field).
  'wettbewerb-leipzig': { ergebnis: '1. Preis' },
};

function decodeHtmlEntities(str) {
  return str
    .replace(/­/g, '')       // soft hyphens inserted by WordPress
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '–') // en-dash
    .replace(/&#8212;/g, '—') // em-dash
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&[a-z]+;/g, '');
}

function stripHtml(html) {
  return decodeHtmlEntities(
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

// Extracts the Zeitraum value. Primary source: the processed content's
// <dl class="slf-daten"> block (reliable dt/dd pairs). Fallback: the raw WP
// HTML <p>label</p><p>value</p> structure.
function extractZeitraum(processedContent, html) {
  const fromContent = processedContent?.match(/<dt>Zeitraum<\/dt><dd>([\s\S]*?)<\/dd>/);
  if (fromContent) {
    const text = decodeHtmlEntities(fromContent[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim());
    if (text) return text;
  }
  if (!html) return null;
  const m = html.match(/<p[^>]*>\s*Zeitraum\s*<\/p>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return null;
  const text = decodeHtmlEntities(m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim());
  return text || null;
}

// Extracts competition result (1. Preis / 2. Preis / 3. Preis / Ankauf / Anerkennung)
// from the Verfahren field in the already-processed content's <dl class="slf-daten">.
function extractVerfahrenResult(processedContent) {
  if (!processedContent) return null;
  const m = processedContent.match(/<dt>Verfahren<\/dt><dd>([\s\S]*?)<\/dd>/);
  if (!m) return null;
  const verfahren = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const result = verfahren.match(/\b(\d+\.?\s*Preis|Ankauf|Anerkennung)\b/i);
  return result ? normalizeErgebnis(result[1]) : null;
}

function normalizeErgebnis(raw) {
  return raw.replace(/(\d+)\.(Preis)/i, '$1. $2').replace(/\s+/g, ' ').trim();
}

const PRIZE_SUFFIX_RE = /\s*[–\-]\s*(\d+\.?\s*Preis|Ankauf|Anerkennung)\s*$/i;

// Fetches the WP theme-rendered page and extracts the display title (h3) and
// subtitle (div.info). The theme shows these from custom WP fields not exposed
// in the REST API. Returns { titel, untertitel, ergebnis } or null on failure.
async function fetchWpPageData(url, attempts = 3) {
  // The page carries the prize/subtitle only in the theme-rendered <h3>/<div class="info">,
  // not in the REST API. A transient fetch failure here silently drops that data (and the
  // prize for projects whose Verfahren field has no prize — e.g. Leipzig), so retry on
  // network errors before giving up.
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const m = html.match(/<h3>(.*?)<\/h3>\s*<div class="info">(.*?)<\/div>/s);
      if (!m) return null; // page reached but has no display block — legitimately empty

      const h3Raw = m[1].replace(/<[^>]+>/g, '').trim();
      const infoRaw = m[2].replace(/<[^>]+>/g, '').trim();

      const prizeH3 = h3Raw.match(PRIZE_SUFFIX_RE);
      const prizeInfo = infoRaw.match(PRIZE_SUFFIX_RE);

      return {
        titel: decodeHtmlEntities(prizeH3 ? h3Raw.slice(0, prizeH3.index).trim() : h3Raw),
        untertitel: decodeHtmlEntities(prizeInfo ? infoRaw.slice(0, prizeInfo.index).trim() : infoRaw),
        ergebnis: prizeH3
          ? normalizeErgebnis(prizeH3[1])
          : prizeInfo
            ? normalizeErgebnis(prizeInfo[1])
            : null,
      };
    } catch (err) {
      if (attempt === attempts) {
        console.warn(`⚠️   Page fetch failed after ${attempts} attempts: ${url} (${err.message})`);
        return null;
      }
      await new Promise(r => setTimeout(r, 500 * attempt)); // backoff before retry
    }
  }
  return null;
}

// ─── Elementor layout parser ─────────────────────────────────────────────────

// Extract the inner content of a <tag>...</tag> element at startIndex,
// tracking nesting depth so it handles self-similar tags correctly.
function extractElement(html, startIndex, tag) {
  const openStr = `<${tag}`;
  const closeStr = `</${tag}>`;
  let pos = html.indexOf(openStr, startIndex);
  if (pos === -1) return null;
  const innerStart = html.indexOf('>', pos) + 1;
  let depth = 1;
  let i = innerStart;
  while (i < html.length && depth > 0) {
    const o = html.indexOf(openStr, i);
    const c = html.indexOf(closeStr, i);
    if (o !== -1 && (c === -1 || o < c)) { depth++; i = o + openStr.length; }
    else if (c !== -1) {
      depth--;
      if (depth === 0) return { inner: html.slice(innerStart, c), end: c + closeStr.length };
      i = c + closeStr.length;
    } else break;
  }
  return null;
}

// Extract all top-level elementor-col-NN column divs from a section's inner HTML.
// Returns array of { size: number, inner: string }.
function extractColumns(html) {
  const columns = [];
  let pos = 0;
  while (pos < html.length) {
    const divPos = html.indexOf('<div', pos);
    if (divPos === -1) break;
    const tagEnd = html.indexOf('>', divPos);
    if (tagEnd === -1) break;
    const tag = html.slice(divPos, tagEnd + 1);
    const colMatch = tag.match(/elementor-col-(\d+)/);
    if (colMatch) {
      const size = parseInt(colMatch[1], 10);
      const innerStart = tagEnd + 1;
      let depth = 1, i = innerStart;
      while (i < html.length && depth > 0) {
        const o = html.indexOf('<div', i);
        const c = html.indexOf('</div>', i);
        if (o !== -1 && (c === -1 || o < c)) { depth++; i = o + 4; }
        else if (c !== -1) {
          depth--;
          if (depth === 0) { columns.push({ size, inner: html.slice(innerStart, c) }); pos = c + 6; break; }
          i = c + 6;
        } else break;
      }
    } else {
      pos = tagEnd + 1;
    }
  }
  return columns;
}

// Extract content strings from all elementor-widget-container divs in a column's HTML.
// Skips spacers and dividers.
function extractWidgetContainers(html) {
  const widgets = [];
  let pos = 0;
  while (pos < html.length) {
    const divPos = html.indexOf('<div', pos);
    if (divPos === -1) break;
    const tagEnd = html.indexOf('>', divPos);
    if (tagEnd === -1) break;
    const tag = html.slice(divPos, tagEnd + 1);
    if (tag.includes('elementor-widget-container')) {
      const innerStart = tagEnd + 1;
      let depth = 1, i = innerStart;
      while (i < html.length && depth > 0) {
        const o = html.indexOf('<div', i);
        const c = html.indexOf('</div>', i);
        if (o !== -1 && (c === -1 || o < c)) { depth++; i = o + 4; }
        else if (c !== -1) {
          depth--;
          if (depth === 0) {
            const content = html.slice(innerStart, c).trim();
            if (content && !content.includes('elementor-spacer-inner') && !content.includes('elementor-divider')) {
              widgets.push(content);
            }
            pos = c + 6;
            break;
          }
          i = c + 6;
        } else break;
      }
    } else {
      pos = tagEnd + 1;
    }
  }
  return widgets;
}

// Strip Elementor wrapper attributes and noise from a single widget's HTML.
function cleanWidgetContent(html) {
  return html
    .replace(/ (fetchpriority|decoding|loading)="[^"]*"/g, '')
    .replace(/ class="wp-caption"/g, '')
    .replace(/ class="widget-image-caption[^"]*"/g, '')
    .replace(/<\/?div[^>]*>/g, '')
    .replace(/<\/?span[^>]*>/g, '')
    .replace(/<p[^>]*>\s*<\/p>/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n')
    .trim();
}

// Parse the full Elementor HTML into a compact layout-preserving HTML string
// using slf-row / slf-col-NN classes for multi-column sections.
function extractLayout(html) {
  if (!html) return null;

  const blocks = [];
  let pos = 0;
  let inProjektdaten = false;
  let dlItems = [];

  const closeProjektdaten = () => {
    if (dlItems.length) {
      blocks.push(`<p class="slf-daten-heading">Projektdaten</p><dl class="slf-daten">${dlItems.join('')}</dl>`);
    }
    inProjektdaten = false;
    dlItems = [];
  };

  while (pos < html.length) {
    const result = extractElement(html, pos, 'section');
    if (!result) break;
    pos = result.end;

    const secInner = result.inner;
    if (!secInner.includes('elementor-col-')) continue;

    const columns = extractColumns(secInner);
    if (!columns.length) continue;
    const colSizes = columns.map(c => c.size);
    const allHundred = colSizes.every(s => s === 100);

    // ── Projektdaten cluster ──────────────────────────────────────
    // Heading section: col-100 containing <strong>Projektdaten</strong>
    if (allHundred) {
      const widgets = extractWidgetContainers(secInner);
      const flat = widgets.join('');
      if (/<strong>\s*Projektdaten\s*<\/strong>/i.test(flat)) {
        if (inProjektdaten) closeProjektdaten();
        inProjektdaten = true;
        dlItems = [];
        continue;
      }
    }

    // Data row: col-33 + col-66 while inside Projektdaten cluster
    if (inProjektdaten && colSizes.length === 2 && colSizes.includes(33) && colSizes.includes(66)) {
      const labelCol = columns.find(c => c.size === 33);
      const valueCol = columns.find(c => c.size === 66);
      const label = stripHtml(extractWidgetContainers(labelCol.inner).join(' ')).trim();
      const rawValue = extractWidgetContainers(valueCol.inner)
        .map(w => cleanWidgetContent(w)).join(' ')
        .replace(/^<p[^>]*>([\s\S]*?)<\/p>$/, '$1').trim();
      const neutralLabel = LABEL_NEUTRAL[label] || label;
      if (label && rawValue) dlItems.push(`<dt>${neutralLabel}</dt><dd>${rawValue}</dd>`);
      continue;
    }

    // Not a Projektdaten row → close cluster if open
    if (inProjektdaten) closeProjektdaten();

    // ── Regular sections ──────────────────────────────────────────
    if (allHundred) {
      const widgets = extractWidgetContainers(secInner);
      const content = widgets.map(cleanWidgetContent).filter(Boolean).join('\n');
      if (content) blocks.push(content);
    } else {
      let hasContent = false;
      const colDivs = columns.map(col => {
        const content = extractWidgetContainers(col.inner).map(cleanWidgetContent).filter(Boolean).join('\n');
        if (content) hasContent = true;
        return `<div class="slf-col-${col.size}">${content}</div>`;
      });
      if (hasContent) blocks.push(`<div class="slf-row">${colDivs.join('')}</div>`);
    }
  }

  if (inProjektdaten) closeProjektdaten();

  return decodeHtmlEntities(blocks.filter(Boolean).join('\n'));
}

function pickImageUrl(featuredMedia) {
  if (!featuredMedia) return null;
  const sizes = featuredMedia.media_details?.sizes ?? {};
  return (
    featuredMedia.source_url ??
    sizes['2048x2048']?.source_url ??
    sizes.full?.source_url ??
    sizes.large?.source_url ??
    sizes.medium_large?.source_url ??
    null
  );
}

async function fetchAllPosts() {
  const posts = [];
  let page = 1;

  while (true) {
    const url = `${WP_BASE}/posts?per_page=100&page=${page}&_embed&status=publish`;
    const res = await fetch(url);

    if (res.status === 400) break; // WP returns 400 when page exceeds total
    if (!res.ok) throw new Error(`WP API responded ${res.status} for page ${page}`);

    const batch = await res.json();
    if (!batch.length) break;

    posts.push(...batch);

    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
    if (page >= totalPages) break;
    page++;
  }

  return posts;
}

function mapPost(post, pageData = null) {
  const terms = post._embedded?.['wp:term']?.[0] ?? [];
  const matchedTerms = terms.filter(t => KNOWN_SLUGS.has(t.slug));
  if (matchedTerms.length === 0) return null; // skip uncategorized / non-project posts

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = pickImageUrl(featuredMedia);
  const beschreibung = stripHtml(post.excerpt?.rendered ?? post.content?.rendered ?? '');
  const content = extractLayout(post.content?.rendered ?? null);
  const fallbacks = FALLBACKS[post.slug] ?? {};

  return {
    id: post.slug,
    titel: pageData?.titel || decodeHtmlEntities(post.title.rendered),
    untertitel: pageData?.untertitel ?? '',
    beschreibung,
    content,
    ergebnis: pageData?.ergebnis || extractVerfahrenResult(content) || fallbacks.ergebnis || null,
    ort: null,
    jahr: extractZeitraum(content, post.content?.rendered ?? null),
    kategorie: matchedTerms.map(t => CATEGORY_LABEL[t.slug]),
    flaeche: null,
    auftraggeber: null,
    tone: imageUrl ? 'photo' : 'plan',
    image: imageUrl,
    wpId: post.id,
    wpDate: post.date,
    wpLink: post.link,
  };
}

async function main() {
  console.log('🔄  Snapshot WordPress (secours uniquement)…');
  console.log('    ℹ️  Le site est généré depuis content/projekte/ — ce script n\'écrit QUE dans backup/.');
  console.log(`    Source: ${WP_BASE}/posts`);

  let posts;
  try {
    posts = await fetchAllPosts();
  } catch (err) {
    console.error(`\n❌  Failed to fetch from WordPress: ${err.message}`);
    console.warn('⚠️   WordPress injoignable — snapshot non mis à jour (sans conséquence pour le site).');
    process.exit(0);
  }

  console.log(`    Fetched ${posts.length} published posts`);

  // Fetch WP page HTML to get display titles and prizes stored in theme custom
  // fields not exposed by the REST API. Throttle to small batches — firing all
  // requests at once overwhelms the slow WP server and causes timeouts that
  // silently drop prizes (see fetchWpPageData).
  console.log('    Fetching page display data…');
  const BATCH = 8;
  const pageDataArr = [];
  for (let i = 0; i < posts.length; i += BATCH) {
    const batch = posts.slice(i, i + BATCH);
    pageDataArr.push(...await Promise.all(batch.map(p => fetchWpPageData(p.link))));
  }

  const projects = posts
    .map((post, i) => mapPost(post, pageDataArr[i]))
    .filter(Boolean)
    .sort((a, b) => new Date(b.wpDate) - new Date(a.wpDate)); // newest first

  // Stats
  const byCategory = {};
  for (const p of projects) {
    byCategory[p.kategorie] = (byCategory[p.kategorie] ?? 0) + 1;
  }
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`    ${cat}: ${count}`);
  }

  // Warnings
  const skipped = posts.length - projects.length;
  if (skipped > 0) {
    console.warn(`⚠️   Skipped ${skipped} posts with unknown/missing category`);
  }
  const noImage = projects.filter(p => !p.image);
  if (noImage.length) {
    console.warn(`⚠️   ${noImage.length} projects have no featured image: ${noImage.map(p => p.id).join(', ')}`);
  }

  // Deduplicate slugs
  const seenIds = new Set();
  for (const p of projects) {
    if (seenIds.has(p.id)) {
      console.warn(`⚠️   Duplicate slug detected: "${p.id}" (wpId ${p.wpId}) — appending suffix`);
      p.id = `${p.id}-${p.wpId}`;
    }
    seenIds.add(p.id);
  }

  const now = new Date().toISOString();
  const output =
    `// ⚠️ SNAPSHOT DE SECOURS de WordPress — n'est PAS utilisé par le site.\n` +
    `// Le site est généré depuis content/projekte/ (voir build-projects-from-content.mjs).\n` +
    `// Dernière synchro : ${now}\n` +
    `// Source : ${WP_BASE}/posts\n\n` +
    `const projects = ${JSON.stringify(projects, null, 2)};\n\nexport default projects;\n`;

  writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`\n✅  Wrote ${projects.length} projects to backup/projects-wp-snapshot.js`);
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err);
  process.exit(1);
});
