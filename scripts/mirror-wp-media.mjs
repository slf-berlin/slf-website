#!/usr/bin/env node
// Miroir local des médias WordPress.
//
// Scanne le code source (src/) pour toutes les URLs d'images WordPress
// (https://www.slf-berlin.de/wordpress/wp-content/uploads/…), y compris les
// variantes srcset et les originaux pleine résolution (suffixe -WxH retiré,
// utilisés par la lightbox), puis les télécharge dans ../wp-media/ (un cran
// AU-DESSUS du repo, hors git — ~1,2 Go) en conservant l'arborescence uploads
// (année/mois/fichier). public/wp-media est un symlink vers ce dossier
// (gitignoré, recréé ici s'il manque) pour que Vite serve et copie les
// fichiers normalement.
//
// Écrit ensuite src/data/wp-media-manifest.json — la liste des fichiers
// effectivement présents en local. Le helper src/lib/wpMedia.js s'en sert au
// rendu pour substituer les URLs WordPress par les copies locales.
//
// Fait aussi un dump JSON brut des posts WordPress dans backup/ (non fatal).
//
// Incrémental : les fichiers déjà téléchargés sont ignorés. Si WordPress est
// injoignable, les fichiers existants sont conservés et le script sort en 0.
//
// Usage : npm run mirror   (lancé aussi par le prebuild, après le sync)

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync, lstatSync, symlinkSync, rmSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
// Le miroir vit HORS du repo (pas commité) ; public/wp-media pointe dessus.
const MEDIA_DIR = join(ROOT, '..', 'wp-media');
const MEDIA_SYMLINK = join(ROOT, 'public', 'wp-media');

// Garantit public/wp-media → ../../wp-media (nécessaire à Vite dev + build).
function ensureMediaSymlink() {
  mkdirSync(MEDIA_DIR, { recursive: true });
  try {
    const st = lstatSync(MEDIA_SYMLINK);
    if (st.isSymbolicLink()) return;
    // Un vrai dossier public/wp-media (ancien emplacement) : on le laisse —
    // le déplacer serait destructif ; prévenir seulement.
    console.warn('⚠️   public/wp-media est un vrai dossier (pas un symlink) — les fichiers seraient commités. Déplacer son contenu vers ../wp-media puis le supprimer.');
    return;
  } catch {
    // n'existe pas → créer le symlink (relatif, robuste si le dossier parent bouge)
    symlinkSync(join('..', '..', 'wp-media'), MEDIA_SYMLINK);
    console.log('🔗  Symlink créé : public/wp-media → ../../wp-media');
  }
}
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'wp-media-manifest.json');
const BACKUP_DIR = join(ROOT, 'backup');
const WP_API = 'https://www.slf-berlin.de/wp-json/wp/v2';

const UPLOADS_RE = /https?:\/\/(?:www\.)?slf-berlin\.de\/wordpress\/wp-content\/uploads\/([^\s"'<>)\\]+?\.(?:jpe?g|png|gif|webp|svg|pdf))/gi;
const SIZE_SUFFIX_RE = /-\d+x\d+(\.[a-zA-Z]+)$/;

// ─── 1. Collecter toutes les URLs référencées dans src/ ─────────────────────

function walkSourceFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkSourceFiles(full, files);
    else if (/\.(jsx?|mjs)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function collectRelPaths() {
  const rels = new Set();
  for (const file of walkSourceFiles(join(ROOT, 'src'))) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(UPLOADS_RE)) {
      const rel = m[1];
      rels.add(rel);
      // Original pleine résolution (lightbox) : retirer le suffixe -WxH
      const full = rel.replace(SIZE_SUFFIX_RE, '$1');
      if (full !== rel) rels.add(full);
    }
  }
  return rels;
}

// ─── 2. Télécharger ──────────────────────────────────────────────────────────

async function download(rel, attempts = 3) {
  const dest = join(MEDIA_DIR, rel);
  if (existsSync(dest) && statSync(dest).size > 0) return 'cached';

  const url = `https://www.slf-berlin.de/wordpress/wp-content/uploads/${rel}`;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (res.status === 404) return 'missing'; // n'existe pas côté WP (ex. original d'une image recadrée)
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length) throw new Error('empty response');
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, buf);
      return 'downloaded';
    } catch (err) {
      if (attempt === attempts) {
        console.warn(`⚠️   Échec: ${rel} (${err.message})`);
        return 'failed';
      }
      await new Promise(r => setTimeout(r, 700 * attempt));
    }
  }
  return 'failed';
}

async function downloadAll(rels) {
  const queue = [...rels].sort();
  const stats = { downloaded: 0, cached: 0, missing: 0, failed: 0 };
  const CONCURRENCY = 8;
  let index = 0;

  async function worker() {
    while (index < queue.length) {
      const rel = queue[index++];
      const result = await download(rel);
      stats[result]++;
      if (result === 'downloaded') console.log(`    ↓ ${rel}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return stats;
}

// ─── 3. Manifest : ce qui est réellement présent en local ───────────────────

function writeManifest(rels) {
  const present = [...rels].filter(rel => {
    const dest = join(MEDIA_DIR, rel);
    return existsSync(dest) && statSync(dest).size > 0;
  }).sort();
  writeFileSync(MANIFEST_PATH, JSON.stringify(present, null, 2) + '\n', 'utf8');
  return present;
}

// ─── 4. Dump JSON brut de WordPress (backup de secours, non fatal) ───────────

async function backupRawPosts() {
  try {
    const posts = [];
    let page = 1;
    while (true) {
      const res = await fetch(`${WP_API}/posts?per_page=100&page=${page}&_embed&status=publish`, {
        signal: AbortSignal.timeout(30000),
      });
      if (res.status === 400) break;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const batch = await res.json();
      if (!batch.length) break;
      posts.push(...batch);
      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
      if (page >= totalPages) break;
      page++;
    }
    mkdirSync(BACKUP_DIR, { recursive: true });
    writeFileSync(
      join(BACKUP_DIR, 'wp-posts-raw.json'),
      JSON.stringify({ exportedAt: new Date().toISOString(), source: `${WP_API}/posts`, count: posts.length, posts }, null, 2),
      'utf8'
    );
    console.log(`💾  Dump brut WordPress : backup/wp-posts-raw.json (${posts.length} posts)`);
  } catch (err) {
    console.warn(`⚠️   Dump brut WordPress impossible (${err.message}) — le backup existant est conservé.`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🖼   Miroir des médias WordPress → ../wp-media/ (hors repo, servi via le symlink public/wp-media)');
  ensureMediaSymlink();

  const rels = collectRelPaths();
  console.log(`    ${rels.size} fichiers référencés dans src/ (variantes srcset et originaux inclus)`);

  const stats = await downloadAll(rels);
  console.log(`    Téléchargés: ${stats.downloaded} · déjà en local: ${stats.cached} · absents côté WP: ${stats.missing} · échecs: ${stats.failed}`);

  const present = writeManifest(rels);
  console.log(`✅  Manifest : ${present.length}/${rels.size} fichiers disponibles en local (src/data/wp-media-manifest.json)`);

  if (stats.failed > 0) {
    console.warn(`⚠️   ${stats.failed} téléchargements ont échoué — relancer \`npm run mirror\` pour les retenter.`);
  }

  await backupRawPosts();
}

main().catch(err => {
  console.error('\n❌  Erreur inattendue:', err);
  // Ne pas casser le build : les fichiers déjà en miroir restent utilisables.
  process.exit(0);
});
