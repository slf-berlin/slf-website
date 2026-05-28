import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/SLF_Logo_Lang.svg'
import { tokens as A } from '../tokens'
import { PROJEKTE_NAV, filterHref } from '../data/filters'
import { useWindowWidth } from '../hooks/useWindowWidth'
import projects from '../data/projects'

const navItems = [
  {
    label: 'Projekte',
    to: '/projekte',
    children: PROJEKTE_NAV.map((f) => ({ label: f.label, to: filterHref(f.key) })),
  },
  {
    label: 'Büro',
    to: '/buero',
    children: [
      { label: 'Über Uns', to: '/buero/ueber-uns' },
      { label: 'Leistungen', to: '/buero#leistungen' },
      { label: 'Team', to: '/buero/team' },
    ],
  },
  { label: 'Kontakt', to: '/kontakt' },
]

function SearchIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8.5" r="5.5" stroke={color} strokeWidth="1.5" />
      <line x1="12.5" y1="12.5" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="1" y1="1" x2="17" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="1" x2="1" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(null)
  const [hoveredLabel, setHoveredLabel] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHovered, setSearchHovered] = useState(null)
  const closeTimer = useRef(null)
  const searchInputRef = useRef(null)
  const width = useWindowWidth()
  const isMobile = width < 768

  const searchResults = searchQuery.trim().length > 1
    ? projects.filter(p => {
        const q = searchQuery.toLowerCase()
        return (
          p.titel?.toLowerCase().includes(q) ||
          p.beschreibung?.toLowerCase().includes(q) ||
          p.kategorie?.toLowerCase().includes(q)
        )
      }).slice(0, 10)
    : []

  const openSearch = () => {
    setSearchOpen(true)
    setSearchQuery('')
    setMobileOpen(false)
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  useEffect(() => {
    if (!searchOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeSearch() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  const handleEnter = (label) => {
    clearTimeout(closeTimer.current)
    setOpen(label)
  }

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120)
  }

  return (
    <>
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: A.bg,
        borderBottom: 'none',
        padding: isMobile ? '20px 20px' : '24px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="Stadt Land Fluss — Städtebau und Stadtplanung PartG mbB"
            style={{ height: isMobile ? 16 : 20, width: 'auto', display: 'block' }}
          />
        </Link>

        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={openSearch}
              aria-label="Suche öffnen"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <SearchIcon size={18} color={A.mute} />
            </button>

            <button
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Menü öffnen"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 8, display: 'flex', flexDirection: 'column',
                gap: 5, alignItems: 'center',
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 22, height: 2, background: A.ink }} />
              ))}
            </button>

            {mobileOpen && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 300,
              }} onClick={() => setMobileOpen(false)}>
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    background: A.bg, borderBottom: `1px solid ${A.rule}`,
                    padding: '16px 20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Link to="/" onClick={() => setMobileOpen(false)} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <img src={logo} alt="Stadt Land Fluss" style={{ height: 16, width: 'auto', display: 'block' }} />
                    </Link>
                    <button
                      onClick={() => setMobileOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: A.ink, padding: 4 }}
                      aria-label="Menü schließen"
                    >
                      ×
                    </button>
                  </div>
                  {navItems.map(({ label, to }, i) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'block', padding: '14px 0',
                        fontSize: 19, letterSpacing: '0.01em',
                        color: pathname === to || pathname.startsWith(to + '/') ? A.ink : A.mute,
                        borderBottom: i < navItems.length - 1 ? `1px solid ${A.ruleSoft}` : 'none',
                        fontWeight: pathname === to || pathname.startsWith(to + '/') ? 600 : 500,
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <nav style={{ display: 'flex', gap: 52, fontSize: 19, alignItems: 'center' }}>
              {navItems.map(({ label, to, children }) => {
                const active = pathname === to
                  || (children && pathname.startsWith(to + '/'))
                const isOpen = open === label
                const isHovered = hoveredLabel === label

                return (
                  <div
                    key={label}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => children ? handleEnter(label) : null}
                    onMouseLeave={children ? handleLeave : null}
                  >
                    <Link
                      to={to}
                      onMouseEnter={() => setHoveredLabel(label)}
                      onMouseLeave={() => setHoveredLabel(null)}
                      style={{
                        color: (active || isHovered) ? A.ink : A.mute,
                        borderBottom: (active || isHovered) ? `3px solid ${A.accent}` : '3px solid transparent',
                        paddingBottom: 4,
                        fontWeight: active ? 600 : 500,
                        letterSpacing: '0.01em',
                        display: 'block',
                        transition: 'border-color 0.15s ease, color 0.15s ease',
                      }}>
                      {label}
                    </Link>

                    {children && (
                      <div
                        onMouseEnter={() => handleEnter(label)}
                        onMouseLeave={handleLeave}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 14px)',
                          right: 0,
                          background: A.bg,
                          border: `1px solid ${A.rule}`,
                          minWidth: 228,
                          zIndex: 200,
                          pointerEvents: isOpen ? 'auto' : 'none',
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                          transition: 'opacity 0.15s ease, transform 0.15s ease',
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: -14, left: 0, right: 0, height: 14,
                        }} />

                        {children.map((child, i) => (
                          <DropdownItem
                            key={child.to}
                            child={child}
                            isLast={i === children.length - 1}
                            onClose={() => setOpen(null)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            <SearchButton onClick={openSearch} />
          </div>
        )}
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 400,
          background: A.bg,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Search input bar */}
          <div style={{
            padding: isMobile ? '20px' : '24px 56px',
            borderBottom: `1px solid ${A.rule}`,
            display: 'flex', alignItems: 'center', gap: 16,
            flexShrink: 0,
          }}>
            <SearchIcon size={20} color={A.mute} />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Projekt suchen…"
              autoComplete="off"
              style={{
                flex: 1,
                border: 'none', outline: 'none',
                fontSize: isMobile ? 18 : 19,
                color: A.ink,
                background: 'transparent',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
              }}
            />
            <button
              onClick={closeSearch}
              aria-label="Suche schließen"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CloseIcon size={18} color={A.mute} />
            </button>
          </div>

          {/* Results */}
          <div style={{
            overflowY: 'auto',
            flex: 1,
            padding: isMobile ? '16px 20px' : '16px 56px',
          }}>
            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <p style={{
                color: A.mute, fontSize: 15,
                marginTop: 32,
              }}>
                Keine Projekte gefunden.
              </p>
            )}

            {searchQuery.trim().length <= 1 && (
              <p style={{
                color: A.mute, fontSize: 14,
                marginTop: 32,
              }}>
                Projekttitel, Kategorie oder Beschreibung eingeben
              </p>
            )}

            {searchResults.map((p, i) => (
              <SearchResult
                key={p.id}
                project={p}
                isLast={i === searchResults.length - 1}
                onSelect={closeSearch}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function SearchButton({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Suche öffnen"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0.55,
        transition: 'opacity 0.15s ease',
      }}
    >
      <SearchIcon size={20} color={A.ink} />
    </button>
  )
}

function SearchResult({ project, isLast, onSelect }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={`/projekte/${project.id}`}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '18px 0',
        borderBottom: isLast ? 'none' : `1px solid ${A.ruleSoft}`,
        background: hovered ? A.accentSoft : 'transparent',
        margin: '0 -12px',
        paddingLeft: 12,
        paddingRight: 12,
        transition: 'background 0.1s ease',
      }}
    >
      <div style={{
        fontSize: 13, color: A.mute, fontWeight: 600, marginBottom: 5,
      }}>
        {project.kategorie}
      </div>
      <div style={{ fontSize: 18, color: A.ink, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
        {project.titel}
      </div>
      {project.beschreibung && (
        <div style={{
          fontSize: 15, color: A.mute, marginTop: 5,
          lineHeight: 1.6, letterSpacing: '0.01em',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.beschreibung}
        </div>
      )}
    </Link>
  )
}

function DropdownItem({ child, isLast, onClose }) {
  const [hovered, setHovered] = useState(false)
  const { pathname, search, hash } = useLocation()
  const active = pathname + search + hash === child.to

  return (
    <Link
      to={child.to}
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '11px 20px',
        fontSize: 15,
        letterSpacing: '0.02em',
        color: active ? A.ink : hovered ? A.ink : A.mute,
        background: hovered ? A.accentSoft : 'transparent',
        borderBottom: isLast ? 'none' : `1px solid ${A.ruleSoft}`,
        transition: 'color 0.1s ease, background 0.1s ease',
        fontWeight: active ? 600 : 500,
      }}
    >
      {child.label}
    </Link>
  )
}
