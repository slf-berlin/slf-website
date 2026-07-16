#!/usr/bin/env node
// Vérification de non-régression de la migration CMS : compare le
// src/data/projects.js régénéré depuis content/projekte/ avec la version
// d'avant migration (git). Chaque projet doit être identique champ par champ
// (content à l'octet près) ; seuls le header et le champ `themen` diffèrent.
//
// Usage : node scripts/verify-content-roundtrip.mjs [ref-git]   (défaut : main)

import { execSync } from 'child_process';
import { writeFileSync, mkdtempSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ref = process.argv[2] ?? 'main';

const oldSource = execSync(`git show ${ref}:src/data/projects.js`, {
  cwd: join(__dirname, '..'),
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
const tmp = mkdtempSync(join(tmpdir(), 'slf-verify-'));
const oldPath = join(tmp, 'projects-old.mjs');
writeFileSync(oldPath, oldSource, 'utf8');

const oldProjects = (await import(oldPath)).default;
const newProjects = (await import('../src/data/projects.js')).default;

let errors = 0;
const err = (msg) => { errors++; console.error(`❌  ${msg}`); };

if (oldProjects.length !== newProjects.length) {
  err(`Nombre de projets : ${oldProjects.length} avant vs ${newProjects.length} après`);
}

const FIELDS = ['id', 'titel', 'untertitel', 'beschreibung', 'content', 'ergebnis', 'ort',
  'jahr', 'kategorie', 'flaeche', 'auftraggeber', 'tone', 'image', 'wpId', 'wpDate', 'wpLink'];

for (let i = 0; i < Math.min(oldProjects.length, newProjects.length); i++) {
  const a = oldProjects[i];
  const b = newProjects[i];
  if (a.id !== b.id) {
    err(`Ordre différent à l'index ${i} : "${a.id}" vs "${b.id}"`);
    continue;
  }
  for (const f of FIELDS) {
    const va = JSON.stringify(a[f] ?? null);
    const vb = JSON.stringify(b[f] ?? null);
    if (va !== vb) {
      if (f === 'content') {
        const sa = a.content ?? '', sb = b.content ?? '';
        let j = 0;
        while (j < Math.min(sa.length, sb.length) && sa[j] === sb[j]) j++;
        err(`${a.id} : content diffère à l'octet ${j}\n    avant: ${JSON.stringify(sa.slice(Math.max(0, j - 40), j + 60))}\n    après: ${JSON.stringify(sb.slice(Math.max(0, j - 40), j + 60))}`);
      } else {
        err(`${a.id} : champ "${f}" diffère — avant ${va} vs après ${vb}`);
      }
    }
  }
}

// Le nouveau champ themen doit couvrir ce que couvrait src/data/themen.js.
try {
  const themenSource = execSync(`git show ${ref}:src/data/themen.js`, {
    cwd: join(__dirname, '..'), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  const themenPath = join(tmp, 'themen-old.mjs');
  writeFileSync(themenPath, themenSource, 'utf8');
  const { PROJECT_THEMEN } = await import(themenPath);
  for (const p of newProjects) {
    const expected = JSON.stringify(PROJECT_THEMEN[p.id] ?? []);
    const actual = JSON.stringify(p.themen ?? []);
    if (expected !== actual) err(`${p.id} : themen — avant ${expected} vs après ${actual}`);
  }
} catch {
  console.warn('⚠️   themen.js introuvable dans la ref git — vérification themen sautée.');
}

if (errors === 0) {
  console.log(`✅  0 diff — les ${newProjects.length} projets régénérés sont identiques à ${ref} (+ champ themen).`);
} else {
  console.error(`\n❌  ${errors} différence(s) détectée(s).`);
  process.exit(1);
}
