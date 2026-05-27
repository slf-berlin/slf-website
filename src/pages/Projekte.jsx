import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProjectImage from '../components/ProjectImage'
import projects from '../data/projects'
import { PROJEKTE_NAV, FILTER_FN, filterHref } from '../data/filters'
import { useWindowWidth } from '../hooks/useWindowWidth'

export default function Projekte() {
  const [searchParams] = useSearchParams()
  const width = useWindowWidth()
  const isMobile = width < 640
  const activeKey = searchParams.get('filter')

  const filtered = activeKey && FILTER_FN[activeKey]
    ? projects.filter(FILTER_FN[activeKey])
    : projects

  return (
    <div style={base}>
      <Nav />

      {/* Filter bar */}
      <div style={{
        padding: isMobile ? '16px 20px' : '20px 56px',
        borderBottom: `1px solid ${A.rule}`,
        display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 28, alignItems: 'center',
        fontSize: 13, color: A.mute,
      }}>
        <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filter</span>
        {PROJEKTE_NAV.map((f) => {
          const isActive = f.key === activeKey || (!f.key && !activeKey)
          return (
            <Link
              key={f.key ?? 'all'}
              to={filterHref(f.key)}
              style={{
                padding: '0 0 3px',
                fontSize: 13,
                color: isActive ? A.ink : A.mute,
                borderBottom: isActive ? `2px solid ${A.accent}` : '2px solid transparent',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {f.label}
            </Link>
          )
        })}
        <span style={{ marginLeft: 'auto', fontSize: 12 }}>
          Sortieren: <strong style={{ color: A.ink, fontWeight: 500 }}>Jahr ↓</strong>
        </span>
      </div>

      {/* Project grid */}
      <div style={{
        padding: isMobile ? '32px 20px 56px' : '48px 56px 72px',
        display: 'grid',
        gridTemplateColumns: width < 640 ? '1fr' : width < 1024 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: width < 640 ? '48px 0' : '72px 40px',
      }}>
        {filtered.map((p) => (
          <div key={p.id}>
            <ProjectImage proj={p} ratio="4/3" />
            <div style={{
              marginTop: 18, display: 'flex', justifyContent: 'space-between',
              fontSize: 11, color: A.mute, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <span>{p.kategorie}</span>
              <span>{p.jahr}</span>
            </div>
            <h3 style={{
              fontSize: 24, fontWeight: 500, lineHeight: 1.2,
              letterSpacing: '0', margin: '10px 0 0',
            }}>
              {p.titel}
            </h3>
            {p.untertitel && (
              <div style={{ fontSize: 15, color: A.mute, marginTop: 3 }}>{p.untertitel}</div>
            )}
            <div style={{
              marginTop: 14,
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12, color: A.mute,
            }}>
              <span>{p.ort}</span>
              <span>{p.flaeche}</span>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
