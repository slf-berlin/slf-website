export const PROJEKTE_NAV = [
  { label: 'Alle', key: null },
  { label: 'Entwicklungskonzepte', key: 'entwicklungskonzepte' },
  { label: 'Wettbewerbe', key: 'wettbewerbe' },
  { label: 'Bauleitplanung', key: 'bauleitplanung' },
  { label: 'Verfahrensbetreuung', key: 'verfahrensbetreuung' },
  { label: 'Projektliste', key: 'projektliste' },
]

export const FILTER_FN = {
  entwicklungskonzepte: (p) => [].concat(p.kategorie).includes('Entwicklungskonzepte'),
  wettbewerbe: (p) => [].concat(p.kategorie).includes('Wettbewerbe'),
  bauleitplanung: (p) => [].concat(p.kategorie).includes('Bauleitplanung'),
  verfahrensbetreuung: (p) => [].concat(p.kategorie).includes('Verfahrensbetreuung'),
  projektliste: () => true,
}

export function filterHref(key) {
  return key ? `/projekte?filter=${key}` : '/projekte'
}
