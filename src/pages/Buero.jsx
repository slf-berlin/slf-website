import { useState, useEffect, Fragment } from 'react'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { usePageMeta } from '../hooks/usePageMeta'
import { ensureImageStyles } from '../components/SmartImage'
import { TEAM } from '../data/team'
import { localMedia } from '../lib/wpMedia'
// Textes éditables via le CMS (/admin → Seitentexte → Büro).
// Les icônes SVG des Leistungen restent ici (LEISTUNGEN_ICONS, par `key`).
import texte from '../../content/pages/buero.json'

ensureImageStyles()

// Image with a shimmer skeleton while loading; img keeps its aspectRatio/size so
// the absolute skeleton fills the reserved box. Parent must be position: relative.
function ImgWithSkeleton({ src, alt, style }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && <div className="slf-img-skeleton" />}
      <img
        src={localMedia(src)}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ ...style, position: 'relative', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />
    </>
  )
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Logo-glyph reveal masks for the Büro gallery. The three SLF logo shapes
// (rectangle = Stadt, pill = Land, wave = Wasser) are extracted verbatim from
// public/SLF_Logo_notext_b.svg with their original matrix. Each glyph is then
// centered + scaled (~72%) into a 4:3 frame (1828×1371) so it sits inside the
// 4/3 photo without distortion.
const GLYPH_MATRIX = 'matrix(17.361113,0,0,17.361113,-557.153936,-449.619899)'
const MASK_SHAPES = {
  rect: {
    center: 'translate(99.13,403.76) scale(0.903)',
    el: <rect x="42.12" y="34.649" width="83.906" height="18.434" fill={A.accent} />,
  },
  pill: {
    center: 'translate(97.87,-101.16) scale(0.904)',
    el: (
      <path
        fill={A.accent}
        d="M116.662,66.807C116.624,66.807 116.587,66.812 116.548,66.812L51.744,66.812C51.672,66.811 51.601,66.802 51.529,66.802C51.457,66.802 51.387,66.811 51.315,66.812L51.062,66.812L51.062,66.825C46.118,67.066 42.183,71.083 42.183,76.02C42.183,80.955 46.118,84.973 51.062,85.214L51.062,85.238L116.619,85.238L116.619,85.236C116.633,85.236 116.648,85.238 116.662,85.238C121.823,85.238 126.006,81.112 126.006,76.022C126.006,70.932 121.823,66.807 116.662,66.807Z"
      />
    ),
  },
  wave: {
    center: 'translate(122.90,-547.06) scale(0.868)',
    el: (
      <path
        fill={A.accent}
        d="M102.286,120.136C101.784,120.136 101.278,120.13 100.765,120.12C93.346,120.348 86.989,117.655 81.354,115.271C76.742,113.319 72.761,111.628 69.006,111.723C61.131,112.469 59.494,113.183 50.478,119.58L40.93,106.124C51.757,98.442 56.038,96.363 67.711,95.272L68.14,95.243C75.636,94.932 82.089,97.666 87.784,100.077C92.483,102.064 96.538,103.78 100.358,103.624L100.613,103.614L100.868,103.619C105.51,103.71 108.559,103.776 119.25,96.82L128.248,110.65C115.409,119.004 109.226,120.136 102.286,120.136Z"
      />
    ),
  },
}

function GalleryFigure({ src, caption, shape }) {
  const [hover, setHover] = useState(false)
  const s = MASK_SHAPES[shape]
  return (
    <figure
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ margin: 0 }}
    >
      {/* image-only wrapper so the khaki shape never overlaps the caption below */}
      <div style={{ position: 'relative', lineHeight: 0 }}>
        <ImgWithSkeleton
          src={src}
          alt={caption}
          style={{
            display: 'block',
            width: '100%',
            aspectRatio: '4 / 3',
            objectFit: 'cover',
          }}
        />
        {/* Khaki glyph starts oversized (covers corners) and retracts to its
            centered size — the colour gathers from the corners into the shape. */}
        <svg
          viewBox="0 0 1828 1371"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.4s ease-in',
            pointerEvents: 'none',
          }}
        >
          <g transform={s.center}>
            <g
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transform: `scale(${hover ? 1 : 7})`,
                transition: prefersReducedMotion
                  ? 'none'
                  : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <g transform={GLYPH_MATRIX}>{s.el}</g>
            </g>
          </g>
        </svg>
      </div>
      <figcaption style={{
        fontSize: 14,
        color: A.mute,
        marginTop: 8,
        fontStyle: 'italic',
      }}>
        {caption}
      </figcaption>
    </figure>
  )
}

// Icônes des Leistungen — restent dans le code (SVG), associées aux entrées
// éditables de content/pages/buero.json via leur `key`.
const LEISTUNGEN_ICONS = {
  stadtentwicklung: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="18" width="5" height="10"/>
      <rect x="9" y="11" width="6" height="17"/>
      <rect x="17" y="15" width="5" height="13"/>
      <rect x="24" y="7" width="6" height="21"/>
      <line x1="1" y1="28" x2="31" y2="28"/>
    </svg>
  ),
  raumanalyse: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="13" r="8"/>
      <line x1="19" y1="19" x2="28" y2="28"/>
      <line x1="10" y1="13" x2="16" y2="13"/>
      <line x1="13" y1="10" x2="13" y2="16"/>
    </svg>
  ),
  rahmenplanung: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="26" height="26"/>
      <line x1="12" y1="3" x2="12" y2="29"/>
      <line x1="20" y1="3" x2="20" y2="29"/>
      <line x1="3" y1="12" x2="29" y2="12"/>
      <line x1="3" y1="20" x2="29" y2="20"/>
    </svg>
  ),
  bauleitplanung: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="24" height="26"/>
      <line x1="9" y1="9" x2="23" y2="9"/>
      <line x1="9" y1="14" x2="23" y2="14"/>
      <line x1="9" y1="19" x2="17" y2="19"/>
      <polyline points="17,22 20,25 27,18"/>
    </svg>
  ),
  quartier: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="10" height="10"/>
      <rect x="19" y="3" width="10" height="10"/>
      <rect x="3" y="19" width="10" height="10"/>
      <rect x="19" y="19" width="10" height="10"/>
    </svg>
  ),
  qualitaet: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="12" r="8"/>
      <polyline points="11,19 8,29 16,25 24,29 21,19"/>
      <polyline points="12,12 15,15 20,9"/>
    </svg>
  ),
  partizipation: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="8" r="4"/>
      <path d="M8 28c0-8 16-8 16 0"/>
      <circle cx="6" cy="12" r="3"/>
      <path d="M1 26c0-6 10-6 10 0"/>
      <circle cx="26" cy="12" r="3"/>
      <path d="M21 26c0-6 10-6 10 0"/>
    </svg>
  ),
  koordinierung: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="5" r="3"/>
      <circle cx="5" cy="25" r="3"/>
      <circle cx="27" cy="25" r="3"/>
      <line x1="14" y1="8" x2="7" y2="22"/>
      <line x1="18" y1="8" x2="25" y2="22"/>
      <line x1="8" y1="25" x2="24" y2="25"/>
    </svg>
  ),
}

const LEISTUNGEN = texte.leistungen
const ARBEITSWEISE = texte.arbeitsweise

function BulletList({ items, isMobile }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((item) => (
        <li key={item} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          fontSize: isMobile ? 15 : 16,
          color: A.mute,
          lineHeight: 1.65,
          marginBottom: 6,
        }}>
          <span aria-hidden style={{
            width: 6, height: 6,
            marginTop: isMobile ? 9 : 10,
            background: A.accent,
            flexShrink: 0,
          }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// Bureaux partenaires récurrents — éditables via le CMS (buero.json)
const NETZWERK = texte.netzwerk

function NetLink({ entry, isMobile }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: isMobile ? 14 : 18, fontWeight: 400,
        letterSpacing: '-0.01em', color: A.ink, lineHeight: 1.3,
        textDecoration: 'none',
        borderBottom: `1px solid ${hover ? A.ink : 'transparent'}`,
        transition: 'border-color 0.2s ease',
      }}
    >
      {entry.name.split(',')[0]}
    </a>
  )
}


function Modal({ member, onClose }) {
  const width = useWindowWidth()
  const isMobile = width < 640

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(14, 14, 16, 0.55)',
        zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? 16 : 40,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: A.bg,
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: isMobile ? 24 : 48,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 6, lineHeight: 1,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <line x1="1" y1="1" x2="15" y2="15" stroke={A.mute} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="1" x2="1" y2="15" stroke={A.mute} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{
          display: 'flex',
          gap: isMobile ? 20 : 40,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-start',
        }}>
          <div style={{ flexShrink: 0, width: isMobile ? '55%' : 200, position: 'relative' }}>
            <ImgWithSkeleton
              src={member.photo}
              alt={member.name}
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '3 / 4',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
          </div>

          <div style={{ flex: 1, paddingTop: isMobile ? 0 : 2 }}>
            <div style={{ fontSize: 14, color: A.mute, fontWeight: 600, marginBottom: 7 }}>
              {member.rolle}
            </div>

            {member.email ? (
              <a href={`mailto:${member.email}`} style={{ color: A.ink, textDecoration: 'none' }}>
                <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  {member.name}
                </div>
              </a>
            ) : (
              <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                {member.name}
              </div>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                style={{
                  display: 'inline-block', marginTop: 8,
                  fontSize: 15, color: A.ink,
                  textDecoration: 'underline', textUnderlineOffset: 3,
                }}
              >
                {member.email}
              </a>
            )}

            <div style={{ fontSize: 16, color: A.mute, marginTop: 7, lineHeight: 1.5, marginBottom: 22 }}>
              {member.ausbildung}
            </div>

            <div style={{ marginBottom: 20 }}>
              {member.cv.map(([jahre, text]) => (
                <div key={jahre} style={{ display: 'flex', gap: 16, fontSize: 16, lineHeight: 1.65, color: A.mute }}>
                  <span style={{ minWidth: 90, flexShrink: 0, color: A.mute, fontSize: 15 }}>{jahre}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 16, color: A.mute, lineHeight: 1.65 }}>
              <span style={{ color: A.ink }}>Aufgabenfelder — </span>
              {member.aufgaben}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamCard({ member, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {!loaded && <div className="slf-img-skeleton" />}
        <img
          src={localMedia(member.photo)}
          alt={member.name}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{
            display: 'block',
            width: '100%',
            aspectRatio: '3 / 4',
            objectFit: 'cover',
            objectPosition: 'top',
            opacity: loaded ? 1 : 0,
            transition: 'transform 0.4s ease, opacity 0.4s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(14, 14, 16, 0.08)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }} />
      </div>

      <div style={{ paddingTop: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.005em', color: A.ink, lineHeight: 1.3 }}>
          {member.name}
        </div>
        <div style={{ fontSize: 14, color: A.mute, marginTop: 5 }}>
          {member.rolle}
        </div>
      </div>
    </div>
  )
}

export default function Buero() {
  usePageMeta(
    'Büro',
    'Arbeitsweise, Leistungen, Team und Netzwerk von Stadt Land Fluss — Büro für Stadtplanung und Städtebau in Berlin.'
  )
  const width = useWindowWidth()
  const isMobile = width < 768
  const [selected, setSelected] = useState(null)

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 112
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 8'

  return (
    <div style={base}>
      <Nav />

      {/* Hero */}
      <div style={{ paddingLeft: isMobile ? 12 : 36, paddingRight: isMobile ? 12 : 36 }}>
        <div style={{ position: 'relative', height: isMobile ? 220 : 500 }}>
        <ImgWithSkeleton
          src="https://www.slf-berlin.de/wordpress/wp-content/uploads/2025/01/img-0826-erweitert-1536x990.jpg"
          alt="Stadt Land Fluss — Büro"
          style={{
            display: 'block',
            width: '100%',
            height: isMobile ? 220 : 500,
            objectFit: 'cover',
            objectPosition: 'center 30%',
          }}
        />
        </div>
      </div>

      {/* 01 / Büro — Über uns */}
      <div style={{
        padding: `${vPad}px ${hPad}px ${isMobile ? 40 : 56}px`,
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: 24,
      }}>
        <div style={{ gridColumn: contentCol }}>
          {texte.introAbsaetze.map((absatz, i) => (
            <p key={i} style={{
              fontSize: isMobile ? 17 : 18,
              lineHeight: 1.8,
              color: A.mute,
              margin: i < texte.introAbsaetze.length - 1 ? '0 0 20px' : 0,
              maxWidth: 620,
            }}>
              {absatz}
            </p>
          ))}
        </div>
      </div>

      {/* 3-image gallery */}
      <div style={{
        padding: `0 ${hPad}px ${vPad}px`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 12 : 16,
        }}>
          {[
            {
              src: 'https://www.slf-berlin.de/wordpress/wp-content/uploads/2024/07/img-7857-scaled-e1720599088182-860x625.jpg',
              caption: 'Immer in der Stadt …',
              shape: 'rect',
            },
            {
              src: 'https://www.slf-berlin.de/wordpress/wp-content/uploads/2024/07/8c968187-cea8-4570-8e05-703808cb86d9-860x645.jpg',
              caption: '… auf dem Land …',
              shape: 'pill',
            },
            {
              src: 'https://www.slf-berlin.de/wordpress/wp-content/uploads/2024/07/img-7862-860x645.jpg',
              caption: '… und am Wasser.',
              shape: 'wave',
            },
          ].map(({ src, caption, shape }) => (
            <GalleryFigure key={src} src={src} caption={caption} shape={shape} />
          ))}
        </div>
      </div>

      {/* Arbeitsweise */}
      <div id="arbeitsweise" style={{
        padding: `${vPad}px ${hPad}px`,
        borderTop: `1px solid ${A.rule}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
          marginBottom: isMobile ? 36 : 52,
        }}>
          <div style={{ gridColumn: contentCol }}>
            <h2 style={{
              fontWeight: 600,
              fontSize: isMobile ? 20 : 30,
              letterSpacing: '-0.015em',
              margin: 0,
            }}>
              {texte.arbeitsweiseTitel}
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
        }}>
          <div style={{
            gridColumn: isMobile ? 'auto' : '3 / span 9',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 0 : 40,
            rowGap: 0,
          }}>
            {ARBEITSWEISE.map((a) => (
              <div key={a.key} style={{
                padding: `${isMobile ? 20 : 40}px 0`,
              }}>
                <div style={{
                  fontSize: isMobile ? 17 : 20,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                  marginBottom: 10,
                  color: A.ink,
                }}>
                  {a.titel}
                </div>
                <p style={{
                  fontSize: isMobile ? 15 : 16,
                  color: A.mute,
                  lineHeight: 1.65,
                  margin: '0 0 14px',
                }}>
                  {a.text}
                </p>
                <BulletList items={a.punkte} isMobile={isMobile} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 02 / Leistungen */}
      <div id="leistungen" style={{
        padding: `${vPad}px ${hPad}px`,
        borderTop: `1px solid ${A.rule}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
          marginBottom: isMobile ? 36 : 52,
        }}>
          <div style={{ gridColumn: contentCol }}>
            <h2 style={{
              fontWeight: 600,
              fontSize: isMobile ? 20 : 30,
              letterSpacing: '-0.015em',
              margin: 0,
            }}>
              {texte.leistungenTitel}
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
        }}>
          <div style={{
            gridColumn: isMobile ? 'auto' : '3 / span 9',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 0 : 40,
            rowGap: 0,
          }}>
            {LEISTUNGEN.map((l) => (
              <div key={l.key} style={{
                padding: `${isMobile ? 20 : 40}px 0`,
              }}>
                <div style={{
                  color: A.mute,
                  marginBottom: 12,
                  lineHeight: 0,
                }}>
                  {LEISTUNGEN_ICONS[l.key]}
                </div>
                <div style={{
                  fontSize: isMobile ? 17 : 20,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                  marginBottom: 10,
                  color: A.ink,
                }}>
                  {l.titel}
                </div>
                <BulletList items={l.punkte} isMobile={isMobile} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 03 / Team */}
      <div id="team" style={{ padding: `${vPad}px ${hPad}px`, borderTop: `1px solid ${A.rule}` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
          marginBottom: isMobile ? 36 : 52,
        }}>
          <div style={{ gridColumn: contentCol }}>
            <h2 style={{
              fontWeight: 600,
              fontSize: isMobile ? 20 : 30,
              letterSpacing: '-0.015em',
              margin: 0,
            }}>
              Das Team
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width < 640 ? 2 : width < 1024 ? 3 : 4}, 1fr)`,
          gap: isMobile ? '24px 16px' : '40px 24px',
        }}>
          {TEAM.map(member => (
            <TeamCard
              key={member.name}
              member={member}
              onClick={() => setSelected(member)}
            />
          ))}
        </div>
      </div>

      {selected && <Modal member={selected} onClose={() => setSelected(null)} />}

      {/* Netzwerk & Kooperationen */}
      <div id="netzwerk" style={{ padding: `${vPad}px ${hPad}px`, borderTop: `1px solid ${A.rule}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 24 }}>
          <div style={{ gridColumn: contentCol }}>
            <h2 style={{ fontWeight: 600, fontSize: isMobile ? 20 : 30, letterSpacing: '-0.015em', margin: 0 }}>
              {texte.netzwerkTitel}
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 16, color: A.mute, lineHeight: 1.6, margin: '16px 0 0', maxWidth: 640 }}>
              {texte.netzwerkIntro}
            </p>
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              gap: isMobile ? '6px 14px' : '10px 24px',
              margin: isMobile ? '32px 0 0' : '44px 0 0',
            }}>
              {NETZWERK.map((entry) => (
                <span key={entry.name} style={{
                  display: 'inline-flex', alignItems: 'center',
                  gap: isMobile ? 14 : 24,
                }}>
                  <NetLink entry={entry} isMobile={isMobile} />
                  <span aria-hidden style={{
                    width: isMobile ? 6 : 9, height: isMobile ? 6 : 9,
                    background: A.accent, flexShrink: 0,
                  }} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

<BackToTop />
      <Footer />
    </div>
  )
}
