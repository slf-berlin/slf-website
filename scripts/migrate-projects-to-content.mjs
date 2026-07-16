#!/usr/bin/env node
// Migration one-shot : src/data/projects.js (généré par le sync WordPress)
// → content/projekte/<id>.yml (source de vérité éditée via le CMS).
//
// À ne relancer que consciemment : écrase les fichiers content/projekte/*.yml
// existants avec l'état actuel de src/data/projects.js.

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { stringify } from 'yaml';
import { parseContent, serializeBlocks } from './lib/projekt-blocks.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../content/projekte');

const projects = (await import('../src/data/projects.js')).default;
const { PROJECT_THEMEN } = await import('../src/data/themen.js');

mkdirSync(OUT_DIR, { recursive: true });

const stats = {};
let fallbackBlocks = 0;

for (const p of projects) {
  const inhalt = parseContent(p.content);

  // Garantie absolue : la re-sérialisation doit être identique à l'octet près.
  const roundTrip = serializeBlocks(inhalt);
  if ((roundTrip ?? null) !== (p.content ?? null)) {
    throw new Error(`Round-trip non identique pour "${p.id}" — migration interrompue.`);
  }

  for (const b of inhalt) {
    stats[b.type] = (stats[b.type] ?? 0) + 1;
    if (b.type === 'html') fallbackBlocks++;
  }

  const doc = {
    titel: p.titel,
    untertitel: p.untertitel ?? '',
    beschreibung: p.beschreibung ?? '',
    ergebnis: p.ergebnis ?? null,
    jahr: p.jahr ?? null,
    kategorie: p.kategorie,
    themen: PROJECT_THEMEN[p.id] ?? [],
    datum: p.wpDate,
    image: p.image ?? null,
    wpId: p.wpId ?? null,
    wpLink: p.wpLink ?? null,
    inhalt,
  };

  const yml = stringify(doc, { lineWidth: 0, defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN' });
  writeFileSync(join(OUT_DIR, `${p.id}.yml`), yml, 'utf8');
}

console.log(`✅  ${projects.length} projets migrés vers content/projekte/`);
console.log('    Blocs :', Object.entries(stats).map(([k, v]) => `${k}=${v}`).join(', '));
if (fallbackBlocks) {
  console.warn(`⚠️   ${fallbackBlocks} blocs "html" bruts (non modélisés — rendu identique mais édition moins confortable)`);
}
