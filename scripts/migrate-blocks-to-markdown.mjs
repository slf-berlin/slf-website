#!/usr/bin/env node
// Migration one-shot : content/projekte/*.yml, blocs legacy (HTML brut)
// → format CMS actuel (Markdown, champs image, colonnes typées).
// Idempotent : les fichiers déjà convertis sont ignorés.

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parse, stringify } from 'yaml';
import { modernizeBlocks, isLegacy } from './lib/html-to-blocks.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../content/projekte');

const stats = {};
let converted = 0;

for (const file of readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.yml'))) {
  const path = join(CONTENT_DIR, file);
  const doc = parse(readFileSync(path, 'utf8'));
  if (!isLegacy(doc.inhalt)) continue;

  doc.inhalt = modernizeBlocks(doc.inhalt);
  for (const b of doc.inhalt) {
    stats[b.type] = (stats[b.type] ?? 0) + 1;
    if (b.type === 'spalten') for (const c of b.spalten) stats[`spalte:${c.type}`] = (stats[`spalte:${c.type}`] ?? 0) + 1;
  }
  writeFileSync(path, stringify(doc, { lineWidth: 0 }), 'utf8');
  converted++;
}

console.log(`✅  ${converted} projets convertis`);
console.log('    ', Object.entries(stats).map(([k, v]) => `${k}=${v}`).join(', '));
