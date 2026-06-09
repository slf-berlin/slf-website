import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProjectImage from '../components/ProjectImage'
import BackToTop from '../components/BackToTop'
import projects from '../data/projects'
import { PROJEKTE_NAV, FILTER_FN, filterHref } from '../data/filters'
import { useWindowWidth } from '../hooks/useWindowWidth'

function extractDaten(content, key) {
  if (!content) return null
  const re = new RegExp(`<dt>${key}</dt><dd>(.*?)</dd>`, 's')
  const m = content.match(re)
  if (!m) return null
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || null
}

function lastYear(jahr) {
  if (!jahr) return 0
  const years = [...jahr.matchAll(/\d{4}/g)].map(m => parseInt(m[0]))
  return years.length ? Math.max(...years) : 0
}

function uploadTime(p) {
  return p.wpDate ? new Date(p.wpDate).getTime() : 0
}

function sortedProjects(list, key, dir) {
  return [...list].sort((a, b) => {
    let va, vb
    if (key === 'jahr') {
      va = lastYear(a.jahr)
      vb = lastYear(b.jahr)
      // À année (dernière du Zeitraum) égale, l'ordre d'upload WordPress fait foi.
      if (va === vb) {
        const ta = uploadTime(a), tb = uploadTime(b)
        return dir === 'asc' ? ta - tb : tb - ta
      }
      return dir === 'asc' ? va - vb : vb - va
    }
    if (key === 'auftraggeber') {
      va = extractDaten(a.content, 'Auftraggeber') || ''
      vb = extractDaten(b.content, 'Auftraggeber') || ''
    } else if (key === 'ort') {
      va = extractDaten(a.content, 'Ort') || ''
      vb = extractDaten(b.content, 'Ort') || ''
    } else if (key === 'kategorie') {
      va = [].concat(a.kategorie).join(', ')
      vb = [].concat(b.kategorie).join(', ')
    } else {
      va = a.titel || ''
      vb = b.titel || ''
    }
    const cmp = va.localeCompare(vb, 'de')
    return dir === 'asc' ? cmp : -cmp
  })
}

function ColHeader({ label, colKey, sortKey, sortDir, onSort }) {
  const active = sortKey === colKey
  return (
    <div
      onClick={() => onSort(colKey)}
      style={{
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 13, fontWeight: active ? 600 : 400,
        color: active ? A.ink : A.mute, userSelect: 'none',
      }}
    >
      {label}
      <span style={{ opacity: active ? 1 : 0.35, fontSize: 13 }}>
        {active && sortDir === 'desc' ? '↑' : '↓'}
      </span>
    </div>
  )
}

const COLS = [
  { key: 'titel', label: 'Projekt', flex: '3' },
  { key: 'auftraggeber', label: 'Auftraggeber', flex: '2' },
  { key: 'kategorie', label: 'Kategorie', flex: '1.5' },
  { key: 'jahr', label: 'Zeitraum', flex: '1' },
  { key: 'ort', label: 'Ort', flex: '1.5' },
]

const GRID_TEMPLATE = '3fr 2fr 1.5fr 1fr 1.5fr'

export default function Projekte() {
  const [searchParams] = useSearchParams()
  const width = useWindowWidth()
  const isMobile = width < 640
  const activeKey = searchParams.get('filter')
  const isListView = activeKey === 'projektliste'

  const [sortKey, setSortKey] = useState('titel')
  const [sortDir, setSortDir] = useState('asc')
  const [hoveredKey, setHoveredKey] = useState(null)

  const filtered = activeKey && FILTER_FN[activeKey]
    ? projects.filter(FILTER_FN[activeKey])
    : projects

  // Vue liste : tri par colonne. Vue grille : ordre par défaut = dernière année du
  // Zeitraum décroissante, puis upload WordPress (le plus récent d'abord) à année égale.
  const displayed = isListView
    ? sortedProjects(filtered, sortKey, sortDir)
    : [...filtered].sort((a, b) => {
        const ya = lastYear(a.jahr), yb = lastYear(b.jahr)
        if (ya !== yb) return yb - ya
        return uploadTime(b) - uploadTime(a)
      })

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div style={base}>
      <Nav />

      {/* Filter bar */}
      <div style={{
        padding: isMobile ? '16px 20px' : '20px 56px',
        borderBottom: `1px solid ${A.rule}`,
        display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 28, alignItems: 'center',
        fontSize: 14, color: A.mute,
      }}>
        {PROJEKTE_NAV.map((f) => {
          const isActive = f.key === activeKey || (!f.key && !activeKey)
          const isHovered = hoveredKey === (f.key ?? 'all')
          const barVisible = isActive || isHovered
          return (
            <Link
              key={f.key ?? 'all'}
              to={filterHref(f.key)}
              onMouseEnter={() => setHoveredKey(f.key ?? 'all')}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                position: 'relative',
                padding: '0 0 5px',
                fontSize: 15,
                color: isActive ? A.ink : A.mute,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {f.label}
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 2,
                background: A.accent,
                width: barVisible ? '100%' : '0%',
                transition: isActive ? 'none' : 'width 0.25s ease',
              }} />
            </Link>
          )
        })}
      </div>

      {isListView ? (
        /* ── List / table view ── */
        <div style={{ padding: isMobile ? '0 20px 56px' : '0 56px 72px' }}>

          {/* Column headers */}
          <div style={{
            display: isMobile ? 'flex' : 'grid',
            gridTemplateColumns: GRID_TEMPLATE,
            gap: '0 24px',
            padding: '20px 0',
            borderBottom: `1px solid ${A.rule}`,
          }}>
            {COLS.filter((c, i) => !isMobile || i === 0).map(c => (
              <ColHeader
                key={c.key}
                label={c.label}
                colKey={c.key}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </div>

          {/* Rows */}
          {displayed.map((p) => {
            const auftraggeber = extractDaten(p.content, 'Auftraggeber')
            const ort = extractDaten(p.content, 'Ort')
            return (
              <Link
                key={p.id}
                to={`/projekte/${p.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div
                  style={{
                    display: isMobile ? 'block' : 'grid',
                    gridTemplateColumns: GRID_TEMPLATE,
                    gap: '0 24px',
                    padding: isMobile ? '16px 0' : '20px 0',
                    borderBottom: `1px solid ${A.ruleSoft}`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = A.accentSoft }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ marginBottom: isMobile ? 6 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.35 }}>{p.titel}</div>
                      {p.ergebnis && (
                        <span style={{
                          fontSize: 12,
                          color: A.mute,
                          background: A.ruleSoft,
                          padding: '2px 6px',
                          borderRadius: 2,
                          whiteSpace: 'nowrap',
                        }}>
                          {p.ergebnis}
                        </span>
                      )}
                    </div>
                    {p.beschreibung && (
                      <div style={{ fontSize: 14, color: A.mute, marginTop: 3, lineHeight: 1.4 }}>
                        {p.beschreibung.length > 100 ? p.beschreibung.slice(0, 100) + '…' : p.beschreibung}
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <div style={{ fontSize: 14, color: A.mute, lineHeight: 1.4, alignSelf: 'start' }}>
                      {auftraggeber || '—'}
                    </div>
                  )}
                  {!isMobile && (
                    <div style={{ fontSize: 14, color: A.mute, alignSelf: 'start' }}>
                      {[].concat(p.kategorie).join(', ')}
                    </div>
                  )}
                  {!isMobile && (
                    <div style={{ fontSize: 14, color: A.mute, alignSelf: 'start' }}>
                      {p.jahr ?? '—'}
                    </div>
                  )}
                  {!isMobile && (
                    <div style={{ fontSize: 14, color: A.mute, alignSelf: 'start' }}>
                      {ort || '—'}
                    </div>
                  )}
                  {isMobile && (
                    <div style={{ fontSize: 14, color: A.mute }}>
                      {[].concat(p.kategorie).join(' / ')} · {p.jahr ?? ''}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        /* ── Grid view ── */
        <div style={{
          padding: isMobile ? '32px 20px 56px' : '48px 56px 72px',
          display: 'grid',
          gridTemplateColumns: width < 640 ? '1fr' : width < 1024 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: width < 640 ? '36px 0' : '44px 40px',
        }}>
          {displayed.map((p) => (
            <Link
              key={p.id}
              to={`/projekte/${p.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <ProjectImage proj={p} ratio="4/3" title={p.titel} subtitle={p.untertitel} ergebnis={p.ergebnis} />
              <div style={{
                marginTop: 12, display: 'flex', justifyContent: 'space-between',
                fontSize: 14, color: A.mute,
              }}>
                <span>{[].concat(p.kategorie).join(' / ')}</span>
                <span>{p.jahr ?? (p.wpDate ? new Date(p.wpDate).getFullYear() : null)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <BackToTop />
      <Footer />
    </div>
  )
}
