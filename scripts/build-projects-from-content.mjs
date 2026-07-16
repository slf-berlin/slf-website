#!/usr/bin/env node
// Génère src/data/projects.js depuis content/projekte/*.yml (source de vérité,
// éditée via le CMS /admin ou à la main). Remplace l'ancien sync WordPress.

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { parse } from 'yaml';
import { serializeBlocks } from './lib/projekt-blocks.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../content/projekte');
const OUTPUT_PATH = join(__dirname, '../src/data/projects.js');

const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.yml'));

const projects = files.map((file) => {
  const doc = parse(readFileSync(join(CONTENT_DIR, file), 'utf8'));
  const id = basename(file, '.yml');
  const image = doc.image ?? null;
  const content = serializeBlocks(doc.inhalt ?? []);

  // Même forme d'objet que l'ancien sync WordPress (ordre des clés compris),
  // plus `themen` (auparavant dans src/data/themen.js).
  return {
    id,
    titel: doc.titel ?? id,
    untertitel: doc.untertitel ?? '',
    beschreibung: doc.beschreibung ?? '',
    content,
    ergebnis: doc.ergebnis ?? null,
    ort: null,
    jahr: doc.jahr != null ? String(doc.jahr) : null,
    kategorie: doc.kategorie ?? [],
    flaeche: null,
    auftraggeber: null,
    tone: image ? 'photo' : 'plan',
    image,
    wpId: doc.wpId ?? null,
    wpDate: doc.datum ?? null,
    wpLink: doc.wpLink ?? null,
    themen: doc.themen ?? [],
  };
});

projects.sort((a, b) => new Date(b.wpDate ?? 0) - new Date(a.wpDate ?? 0));

// Slugs dupliqués = deux fichiers du même nom, impossible ; mais un `datum`
// manquant ou invalide casserait le tri — signaler.
for (const p of projects) {
  if (!p.wpDate || isNaN(new Date(p.wpDate))) {
    console.warn(`⚠️   "${p.id}" : champ datum manquant ou invalide — le projet sera trié en dernier.`);
  }
}

const now = new Date().toISOString();
const output =
  `// ⚠️ FICHIER GÉNÉRÉ AUTOMATIQUEMENT depuis content/projekte/.\n` +
  `// Ne pas éditer à la main — éditer via le CMS (/admin) ou les fichiers .yml,\n` +
  `// puis lancer \`npm run inhalt\` (automatique avec \`npm run dev\` et \`npm run build\`).\n` +
  `// Dernière génération : ${now}\n\n` +
  `const projects = ${JSON.stringify(projects, null, 2)};\n\nexport default projects;\n`;

writeFileSync(OUTPUT_PATH, output, 'utf8');
console.log(`✅  ${projects.length} projets → src/data/projects.js (depuis content/projekte/)`);
