export const PROJEKTE_NAV = [
  { label: '(Gesamt-) Übersicht', key: null },
  { label: 'Entwicklungskonzepte', key: 'entwicklungskonzepte' },
  { label: 'Wettbewerbe', key: 'wettbewerbe' },
  { label: 'Bauleitplanung', key: 'bauleitplanung' },
  { label: 'Verfahrensbetreuung', key: 'verfahrensbetreuung' },
  { label: 'Projektliste', key: 'projektliste' },
]

export const FILTER_FN = {
  entwicklungskonzepte: (p) =>
    p.kategorie.includes('Strategische') ||
    p.kategorie === 'Rahmenplanung' ||
    p.kategorie === 'Quartiersentwicklung' ||
    p.kategorie.toLowerCase().includes('studie') ||
    p.kategorie.toLowerCase().includes('machbarkeit'),
  wettbewerbe: (p) => p.kategorie === 'Städtebaulicher Wettbewerb',
  bauleitplanung: (p) => p.kategorie === 'Bauleitplanung',
  verfahrensbetreuung: (p) => p.kategorie === 'Wettbewerbskoordination',
  projektliste: () => true,
}

export function filterHref(key) {
  return key ? `/projekte?filter=${key}` : '/projekte'
}
