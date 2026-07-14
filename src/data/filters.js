import { PROJECT_THEMEN } from './themen.js'

export const PROJEKTE_NAV = [
  { label: 'Alle', key: null },
  { label: 'Stadt- und Quartiersentwicklung', key: 'stadtentwicklung' },
  { label: 'Städtebau', key: 'staedtebau' },
  { label: 'Bauleitplanung', key: 'bauleitplanung' },
  { label: 'Verfahrensbetreuung', key: 'verfahrensbetreuung' },
  { label: 'Projektliste', key: 'projektliste' },
]

export const FILTER_FN = {
  stadtentwicklung: (p) => [].concat(p.kategorie).includes('Stadt- und Quartiersentwicklung'),
  staedtebau: (p) => [].concat(p.kategorie).includes('Städtebau'),
  bauleitplanung: (p) => [].concat(p.kategorie).includes('Bauleitplanung'),
  verfahrensbetreuung: (p) => [].concat(p.kategorie).includes('Verfahrensbetreuung'),
  projektliste: () => true,
}

// Themen — second, orthogonal filter dimension. Assignments live in
// src/data/themen.js (keyed by project id), not in WordPress.
export const THEMEN_NAV = [
  { label: 'Wohnungsbau', key: 'wohnungsbau' },
  { label: 'Gewerbeentwicklung', key: 'gewerbeentwicklung' },
  { label: 'Klimaanpassung', key: 'klimaanpassung' },
  { label: 'Spielplatzentwicklung', key: 'spielplaetze' },
  { label: 'Nachverdichtung / Innenentwicklung', key: 'nachverdichtung' },
  { label: 'Transformation', key: 'transformation' },
  { label: 'Autoarmes Quartier', key: 'autoarmes-quartier' },
  { label: 'Partizipation', key: 'partizipation' },
  { label: 'Wettbewerbe', key: 'wettbewerbe' },
]

export function projectThemen(p) {
  return PROJECT_THEMEN[p.id] || []
}

export function themaFilterFn(themaKey) {
  return (p) => projectThemen(p).includes(themaKey)
}

export function themaLabel(themaKey) {
  const entry = THEMEN_NAV.find((t) => t.key === themaKey)
  return entry ? entry.label : themaKey
}

export function filterHref(key, thema) {
  const params = new URLSearchParams()
  if (key) params.set('filter', key)
  if (thema) params.set('thema', thema)
  const qs = params.toString()
  return qs ? `/projekte?${qs}` : '/projekte'
}
