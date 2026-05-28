import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProjectImage from '../components/ProjectImage'
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

function avgYear(jahr) {
  if (!jahr) return 0
  const years = [...jahr.matchAll(/\d{4}/g)].map(m => parseInt(m[0]))
  return years.length ? years.reduce((s, y) => s + y, 0) / years.length : 0
}

function sortedProjects(list, key, dir) {
  return [...list].sort((a, b) => {
    let va, vb
    if (key === 'jahr') {
      va = avgYear(a.jahr)
      vb = avgYear(b.jahr)
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
        fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
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

  const filtered = activeKey && FILTER_FN[activeKey]
    ? projects.filter(FILTER_FN[activeKey])
    : projects

  const displayed = isListView ? sortedProjects(filtered, sortKey, sortDir) : filtered

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
        <span style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filter</span>
        {PROJEKTE_NAV.map((f) => {
          const isActive = f.key === activeKey || (!f.key && !activeKey)
          return (
            <Link
              key={f.key ?? 'all'}
              to={filterHref(f.key)}
              style={{
                padding: '0 0 3px',
                fontSize: 14,
                color: isActive ? A.ink : A.mute,
                borderBottom: isActive ? `2px solid ${A.accent}` : '2px solid transparent',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {f.label}
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
                    <div style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.35 }}>{p.titel}</div>
                    {p.beschreibung && (
                      <div style={{ fontSize: 13, color: A.mute, marginTop: 3, lineHeight: 1.4 }}>
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
                    <div style={{ fontSize: 12, color: A.mute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/projekte/${p.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <ProjectImage proj={p} ratio="4/3" title={p.titel} />
              <div style={{
                marginTop: 12, display: 'flex', justifyContent: 'space-between',
                fontSize: 12, color: A.mute, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                <span>{[].concat(p.kategorie).join(' / ')}</span>
                <span>{p.jahr ?? (p.wpDate ? new Date(p.wpDate).getFullYear() : null)}</span>
              </div>
              {p.untertitel && (
                <div style={{ fontSize: 14, color: A.mute, marginTop: 4 }}>{p.untertitel}</div>
              )}
            </Link>
          ))}
        </div>
      )}

      <Footer />
    </div>
  )
}
