import { useEffect } from 'react'

// Titre + meta description par page, sans dépendance externe.
// Valeurs par défaut = celles de index.html (page d'accueil).
const SITE_NAME = 'Stadt Land Fluss'
const DEFAULT_TITLE = 'Stadt Land Fluss — Städtebau und Stadtplanung'
const DEFAULT_DESCRIPTION =
  'Stadt Land Fluss PartG mbB — Praxisorientierte Stadtplanung und kontextueller Städtebau seit über dreißig Jahren aus Berlin.'

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE

    // Google tronque vers ~160 caractères — on coupe proprement en amont.
    const raw = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim()
    const desc = raw.length > 160 ? raw.slice(0, 157).trimEnd() + '…' : raw

    let el = document.querySelector('meta[name="description"]')
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', 'description')
      document.head.appendChild(el)
    }
    el.setAttribute('content', desc)
  }, [title, description])
}
