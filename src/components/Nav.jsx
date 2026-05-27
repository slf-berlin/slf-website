import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/SLF_Logo_Lang.svg'
import { tokens as A } from '../tokens'
import { PROJEKTE_NAV, filterHref } from '../data/filters'
import { useWindowWidth } from '../hooks/useWindowWidth'

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
      { label: 'Leistungen', to: '/buero/leistungen' },
      { label: 'Team', to: '/buero/team' },
    ],
  },
  { label: 'Kontakt', to: '/kontakt' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(null)
  const [hoveredLabel, setHoveredLabel] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef(null)
  const width = useWindowWidth()
  const isMobile = width < 768

  const handleEnter = (label) => {
    clearTimeout(closeTimer.current)
    setOpen(label)
  }

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120)
  }

  return (
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
        <div style={{ position: 'relative' }}>
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
                      fontWeight: pathname === to || pathname.startsWith(to + '/') ? 500 : 400,
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
                    borderBottom: (active || isHovered) ? `2px solid ${A.accent}` : '2px solid transparent',
                    paddingBottom: 4,
                    fontWeight: active ? 500 : 400,
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
                    {/* invisible bridge to fill gap between trigger and panel */}
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
      )}
    </div>
  )
}

function DropdownItem({ child, isLast, onClose }) {
  const [hovered, setHovered] = useState(false)
  const { pathname, search } = useLocation()
  const active = pathname + search === child.to

  return (
    <Link
      to={child.to}
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '11px 20px',
        fontSize: 14,
        letterSpacing: '0.02em',
        color: active ? A.ink : hovered ? A.ink : A.mute,
        background: hovered ? A.accentSoft : 'transparent',
        borderBottom: isLast ? 'none' : `1px solid ${A.ruleSoft}`,
        transition: 'color 0.1s ease, background 0.1s ease',
        fontWeight: active ? 500 : 400,
      }}
    >
      {child.label}
    </Link>
  )
}
