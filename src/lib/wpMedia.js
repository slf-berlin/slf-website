// Substitution des URLs WordPress par les copies locales de public/wp-media/.
//
// Le manifest (généré par `npm run mirror`, scripts/mirror-wp-media.mjs) liste
// les fichiers réellement présents en local. Une URL WordPress dont le fichier
// est en miroir est réécrite vers BASE_URL + 'wp-media/…' ; sinon elle est
// laissée telle quelle (fallback CDN WordPress).

import manifest from '../data/wp-media-manifest.json'

const mirrored = new Set(manifest)

const UPLOADS_PREFIX_RE = /^https?:\/\/(?:www\.)?slf-berlin\.de\/wordpress\/wp-content\/uploads\/(.+)$/
const UPLOADS_GLOBAL_RE = /https?:\/\/(?:www\.)?slf-berlin\.de\/wordpress\/wp-content\/uploads\/([^\s"'<>)\\]+)/g
const SIZE_SUFFIX_RE = /-\d+x\d+(\.[a-zA-Z]+)$/

const localPath = (rel) => import.meta.env.BASE_URL + 'wp-media/' + rel

// URL d'image unique (champ image, photo d'équipe, …) → copie locale si dispo.
export function localMedia(url) {
  if (!url) return url
  const m = url.match(UPLOADS_PREFIX_RE)
  return m && mirrored.has(m[1]) ? localPath(m[1]) : url
}

// Bloc HTML (project.content) : réécrit toutes les URLs WP (src et srcset).
export function localizeMediaHtml(html) {
  if (!html) return html
  return html.replace(UPLOADS_GLOBAL_RE, (full, rel) =>
    mirrored.has(rel) ? localPath(rel) : full
  )
}

// Version pleine résolution pour la lightbox. Accepte un src déjà localisé
// (…/wp-media/…) ou une URL WordPress ; retire le suffixe de taille -WxH et
// retombe sur le src d'origine si l'original n'est pas en miroir.
export function fullSizeMedia(src) {
  if (!src) return src
  const idx = src.indexOf('/wp-media/')
  if (idx !== -1) {
    const rel = src.slice(idx + '/wp-media/'.length)
    const fullRel = rel.replace(SIZE_SUFFIX_RE, '$1')
    return mirrored.has(fullRel) ? localPath(fullRel) : src
  }
  const full = src.replace(SIZE_SUFFIX_RE, '$1')
  const m = full.match(UPLOADS_PREFIX_RE)
  if (m && mirrored.has(m[1])) return localPath(m[1])
  return full
}
