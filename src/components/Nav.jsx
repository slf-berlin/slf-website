import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoRaw from '../assets/SLF_Logo.svg?raw'
import { tokens as A } from '../tokens'
import { PROJEKTE_NAV, filterHref } from '../data/filters'
import { useWindowWidth } from '../hooks/useWindowWidth'
import projects from '../data/projects'

// Strip the XML prolog / DOCTYPE so only the <svg> markup is injected into the DOM.
const logoMarkup = logoRaw.slice(logoRaw.indexOf('<svg'))

// Plays the logo intro once per full page load — not on client-side route changes
// (Nav remounts on every navigation since it lives inside each page, not App.jsx).
// Read in render (pure), flipped in an effect so StrictMode's double-invoke is safe.
let logoIntroDone = false

const LOGO_INTRO_STYLES = `
.slf-logo svg { height: 100%; width: auto; display: block; overflow: visible; }
@media (prefers-reduced-motion: no-preference) {
  .slf-logo--intro .slf-word { opacity: 0; animation: slfWordIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .slf-logo--intro .slf-word-1 { animation-delay: 0.08s; }
  .slf-logo--intro .slf-word-2 { animation-delay: 0.26s; }
  .slf-logo--intro .slf-word-3 { animation-delay: 0.44s; }
}
@keyframes slfWordIn {
  from { opacity: 0; transform: translateY(260px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

// Inline SVG wordmark. `intro` triggers the staggered Stadt → Land → Fluss reveal.
function Logo({ height, intro = false }) {
  return (
    <span
      className={'slf-logo' + (intro ? ' slf-logo--intro' : '')}
      style={{ display: 'inline-block', height, width: 'auto', lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: logoMarkup }}
    />
  )
}

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
      { label: 'Arbeitsweise', to: '/buero#arbeitsweise' },
      { label: 'Leistungen', to: '/buero#leistungen' },
      { label: 'Team', to: '/buero/team' },
      { label: 'Netzwerk & Kooperationen', to: '/buero#netzwerk' },
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
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef(null)
  const searchInputRef = useRef(null)
  const width = useWindowWidth()
  const isMobile = width < 768

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Freeze the intro decision at first mount; subsequent remounts (route changes) skip it.
  const [playIntro] = useState(() => !logoIntroDone)
  useEffect(() => { logoIntroDone = true }, [])

  const searchResults = searchQuery.trim().length > 1
    ? projects.filter(p => {
        const q = searchQuery.toLowerCase()
        return (
          p.titel?.toLowerCase().includes(q) ||
          p.beschreibung?.toLowerCase().includes(q) ||
          (Array.isArray(p.kategorie) ? p.kategorie : [p.kategorie]).some(k => k?.toLowerCase().includes(q))
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
      <style>{LOGO_INTRO_STYLES}</style>
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: A.bg,
        borderBottom: 'none',
        boxShadow: scrolled ? '0 4px 6px -6px rgba(0,0,0,0.2)' : '0 4px 6px -6px rgba(0,0,0,0)',
        transition: 'box-shadow 0.2s ease',
        padding: isMobile ? '16px 20px' : '16px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Logo height={isMobile ? 32 : 48} intro={playIntro} />
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
                      <Logo height={32} />
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
                        borderBottom: 'none',
                        fontWeight: 600,
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
                        paddingBottom: 4,
                        fontWeight: 600,
                        letterSpacing: '0.01em',
                        display: 'block',
                        position: 'relative',
                        transition: 'color 0.15s ease',
                      }}>
                      {label}
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: 3,
                        width: (active || isHovered) ? '100%' : '0%',
                        background: A.accent,
                        transition: 'width 0.2s ease',
                      }} />
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

        {/* Search dropdown — nested inside the sticky header so it anchors
            to the header's own box, not the viewport (header is centered
            within a max-width:1400 container, which can sit far from the
            viewport edge on wide screens). */}
        {searchOpen && (
          <>
            <div
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 399 }}
              onClick={closeSearch}
            />
            <div style={{
              position: 'absolute',
              top: '100%',
              left: isMobile ? 0 : 'auto',
              right: isMobile ? 0 : 56,
              width: isMobile ? 'auto' : 420,
              zIndex: 400,
            background: A.bg,
            border: `1px solid ${A.rule}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column',
            maxHeight: 480,
          }}>
            {/* Input */}
            <div style={{
              padding: isMobile ? '14px 20px' : '14px 18px',
              borderBottom: `1px solid ${A.rule}`,
              display: 'flex', alignItems: 'center', gap: 12,
              flexShrink: 0,
            }}>
              <SearchIcon size={18} color={A.mute} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Projekt suchen…"
                autoComplete="off"
                style={{
                  flex: 1,
                  border: 'none', outline: 'none',
                  fontSize: isMobile ? 16 : 17,
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
                <CloseIcon size={16} color={A.mute} />
              </button>
            </div>

            {/* Results */}
            <div style={{
              overflowY: 'auto',
              padding: isMobile ? '4px 20px 12px' : '4px 18px 12px',
            }}>
              {searchQuery.trim().length > 1 && searchResults.length === 0 && (
                <p style={{ color: A.mute, fontSize: 14, margin: '16px 0' }}>
                  Keine Projekte gefunden.
                </p>
              )}

              {searchQuery.trim().length <= 1 && (
                <p style={{ color: A.mute, fontSize: 13, margin: '16px 0' }}>
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
        </>
      )}
      </div>
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
        {Array.isArray(project.kategorie) ? project.kategorie.join(', ') : project.kategorie}
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
        borderBottom: 'none',
        transition: 'color 0.1s ease, background 0.1s ease',
        fontWeight: active ? 600 : 500,
      }}
    >
      {child.label}
    </Link>
  )
}
