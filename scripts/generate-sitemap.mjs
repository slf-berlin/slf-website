// Génère public/sitemap.xml à partir de src/data/projects.js.
// Lancé automatiquement au prebuild (après le sync WordPress).
//
// ⚠️ Les URLs pointent vers le domaine final (slf-berlin.de, cf. plan de
// déploiement Netlify dans CLAUDE.md). Tant que le site vit sur GitHub Pages
// le sitemap est inerte — il devient actif après la migration du domaine.
// Surcharge possible : SITE_URL=https://autre-domaine npm run build

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import projects from '../src/data/projects.js'

const SITE_URL = (process.env.SITE_URL || 'https://www.slf-berlin.de').replace(/\/$/, '')

const STATIC_ROUTES = [
  '/',
  '/projekte',
  '/buero',
  '/buero/team',
  '/kontakt',
  '/impressum',
  '/datenschutz',
]

const today = new Date().toISOString().slice(0, 10)

function urlEntry(path, lastmod) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    '  </url>',
  ].filter(Boolean).join('\n')
}

const entries = [
  ...STATIC_ROUTES.map(p => urlEntry(p, today)),
  ...projects.map(p => urlEntry(
    `/projekte/${p.id}`,
    p.wpDate ? p.wpDate.slice(0, 10) : null,
  )),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

const out = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))
writeFileSync(out, xml)
console.log(`✓ sitemap.xml : ${STATIC_ROUTES.length} pages + ${projects.length} projets → public/sitemap.xml`)
