import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProjectFeedItem from '../components/ProjectFeedItem'
import projects from '../data/projects'
import heroBild from '../assets/deckblatt-homepage-v4.jpg'
import { useWindowWidth } from '../hooks/useWindowWidth'

const FEATURED_IDS = [
  'umgestaltung-innenstadt-von-burloer-strasse-bis-rathausplatz-in-rhede',
  'wettbewerb-hafenareal-kassel',
  'innenentwicklungskonzepte-iek-berlin',
  'wettbewerbs-koordination-blankenburger-sueden-teilflaeche-sued',
  'wettbewerb-leipzig',
  'forkenbeckstr',
  'seehafen-teichland-2',
]
const featured = FEATURED_IDS.map(id => projects.find(p => p.id === id)).filter(Boolean)

const LEISTUNGEN = [
  {
    titel: 'Stadtplanung',
    label: 'Stadtplanung',
    beschreibung: 'Strategische Planungen, Stadt- und Quartiersentwicklung sowie integrierte Entwicklungskonzepte.',
    punkte: ['Strategische Planungen', 'Stadt- und Quartiersentwicklung', 'Integrierte Entwicklungskonzepte'],
  },
  {
    titel: 'Städtebau',
    label: 'Städtebau',
    beschreibung: 'Städtebauliche Entwürfe, Rahmen- und Masterplanungen, Machbarkeitsstudien und Gestaltungskonzepte für urbane Räume.',
    punkte: ['Städtebauliche Entwürfe', 'Rahmen- und Masterplanungen', 'Machbarkeitsstudien', 'Gestaltungskonzepte'],
  },
  {
    titel: 'Bauleitplanung',
    label: 'Bauleitplanung',
    beschreibung: 'Flächennutzungspläne, Bebauungspläne, Satzungen und Änderungsverfahren sowie formelle Planungsverfahren nach BauGB.',
    punkte: ['Flächennutzungspläne', 'Bebauungspläne', 'Satzungen & Änderungsverfahren', 'Verfahren nach BauGB'],
  },
  {
    titel: 'Verfahrensbetreuung, Partizipation',
    label: 'Verfahren',
    beschreibung: 'Wettbewerbsverfahren, formelle und informelle Beteiligungsverfahren sowie Kommunikation und Moderation.',
    punkte: ['Wettbewerbsverfahren', 'Formelle & informelle Beteiligung', 'Kommunikation & Moderation'],
  },
]

// Hero hover : liste de compétences — puces khaki (carré 4px A.accent
// aligné sur la première ligne de chaque item).
function renderPunkte(punkte, isMobile) {
  const fontSize = isMobile ? 14 : 16
  const itemStyle = { color: A.ink, fontSize, lineHeight: 1.4, fontWeight: 500 }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {punkte.map((p, i) => (
        <li key={i} style={{
          ...itemStyle,
          display: 'flex', alignItems: 'flex-start', gap: 8,
          marginTop: i === 0 ? 0 : 6,
        }}>
          <span style={{
            width: 4, height: 4, background: A.accent,
            flexShrink: 0, marginTop: 7,
          }} />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  const width = useWindowWidth()
  const isMobile = width < 768
  const [hoveredLeistung, setHoveredLeistung] = useState(null)
  const [hoverMehr, setHoverMehr] = useState(false)
  const [hoverAlle, setHoverAlle] = useState(false)

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 112
  const vPadSmall = isMobile ? 40 : 112
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 8'
  const contentColWide = isMobile ? 'auto' : '3 / span 9'

  // The hero image keeps its natural aspect ratio (height:auto, no objectFit:cover)
  // so it is NEVER cropped — cropping would shift the visible strips out from under
  // the fixed-percentage hover zones. The relative wrapper sizes itself to the image,
  // so the inset:0 overlay matches the image box exactly at any screen width.
  // v4 composite is 2831×1423 (4 image strips + 3 white gaps).
  const contentWidth = Math.min(width, 1400)

  // Hero maps 4 service zones onto the v4 composite. Each image strip ≈ 23.6% wide.
  const heroPad = hPad * 2
  const overlayPad = isMobile ? 12 : 36
  const segContentWidth = (contentWidth - heroPad) * 0.236 - overlayPad
  // Persistent nameplate uses the short LEISTUNGEN.label; size to fit the longest
  // short label ("Bauleitplanung", 14 chars). Titles are allowed to wrap, so this
  // only sets an upper bound. D-DIN char width ≈ 0.52em for this condensed font.
  const titleFontSize = Math.min(isMobile ? 13 : 26, Math.max(9, Math.floor(segContentWidth / (14 * 0.52))))
  const showDesc = width >= 1000

  return (
    <div style={base}>
      <Nav />

      {/* Hero */}
      <div style={{ background: A.bg, paddingLeft: hPad, paddingRight: hPad }}>
        <div style={{ position: 'relative' }}>
        <img
          src={heroBild}
          alt="Deckblatt — Quartiersentwicklung, Lageplan & Bebauungsplan"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {[
            // Measured against the v4 composite (2831px wide): 4 image strips + 3 gaps.
            { li: 0, flex: '0 0 23.60%' },
            { gap: true, flex: '0 0 1.80%' },
            { li: 1, flex: '0 0 23.67%' },
            { gap: true, flex: '0 0 1.77%' },
            { li: 2, flex: '0 0 23.70%' },
            { gap: true, flex: '0 0 1.80%' },
            { li: 3, flex: '1' },
          ].map((seg, i) => seg.gap ? (
            <div key={i} style={{ flex: seg.flex, pointerEvents: 'none' }} />
          ) : (
            <div
              key={i}
              onMouseEnter={() => setHoveredLeistung(seg.li)}
              onMouseLeave={() => setHoveredLeistung(null)}
              style={{ flex: seg.flex, position: 'relative', cursor: 'default', overflow: 'hidden' }}
            >
              {/* Nameplate — title always visible; turns khaki and grows
                  upward on hover to reveal the description below it. */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                padding: isMobile ? '8px 8px' : '14px 14px',
                background: hoveredLeistung === seg.li ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.72)',
                transition: 'background 0.25s ease',
                pointerEvents: 'none',
              }}>
                <div style={{
                  fontSize: Math.round(titleFontSize * 0.78),
                  fontWeight: hoveredLeistung === seg.li ? 700 : 500, color: A.ink,
                  letterSpacing: '-0.01em', lineHeight: 1.2,
                  whiteSpace: hoveredLeistung === seg.li ? 'normal' : 'nowrap',
                }}>
                  {seg.li === 3 ? (
                    <>
                      Verfahrensbetreuung
                      <span style={{
                        opacity: hoveredLeistung === 3 ? 1 : 0,
                        transition: 'opacity 0.25s ease',
                      }}>, Partizipation</span>
                    </>
                  ) : LEISTUNGEN[seg.li].titel}
                </div>
                {showDesc && (
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: hoveredLeistung === seg.li ? 260 : 0,
                    opacity: hoveredLeistung === seg.li ? 1 : 0,
                    marginTop: hoveredLeistung === seg.li ? 10 : 0,
                    transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.28s ease, margin-top 0.3s ease',
                  }}>
                    {renderPunkte(LEISTUNGEN[seg.li].punkte, isMobile)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Intro */}
      <div style={{
        padding: `${isMobile ? 32 : vPad}px ${hPad}px ${isMobile ? 40 : 56}px`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
      }}>
        <div style={{ gridColumn: contentCol }}>
          <div style={{
            fontWeight: 600, lineHeight: 1.2,
            letterSpacing: '-0.015em', margin: 0,
            fontSize: isMobile ? 24 : 38,
          }}>
            Willkommen bei Stadt Land Fluss
          </div>
          <div style={{
            fontWeight: 400, lineHeight: 1.2,
            letterSpacing: '-0.015em', marginTop: 6,
            fontSize: isMobile ? 18 : 28,
            color: A.ink,
          }}>
            Städtebau und Stadtplanung PartG mbB
          </div>
          <p style={{
            fontSize: isMobile ? 17 : 21, lineHeight: 1.75, color: A.ink,
            maxWidth: 640, marginTop: 32,
          }}>
            Wir verfügen über umfassende Erfahrungen in der integrierten Stadtplanung, im kontextuellen Städtebau und in der bauleitplanerischen Umsetzung.
          </p>
          <p style={{
            fontSize: isMobile ? 17 : 21, lineHeight: 1.75, color: A.ink,
            maxWidth: 640, marginTop: 20,
          }}>
            Wir arbeiten integrativ, komplex, fachübergreifend sowie teamorientiert und engagieren uns für die Sicherung einer menschenwürdigen, nachhaltigen und gleichwertigen Umwelt.
          </p>
          <p style={{ marginTop: 20, fontSize: isMobile ? 17 : 21, color: A.ink, lineHeight: 1.75, maxWidth: 640 }}>
            Wir freuen uns auf spannende Projekte und weiterhin gute Zusammenarbeit in alten und neuen Konstellationen!
          </p>
          <Link
            to="/buero"
            onMouseEnter={() => setHoverMehr(true)}
            onMouseLeave={() => setHoverMehr(false)}
            style={{
              position: 'relative',
              display: 'inline-block',
              marginTop: 32,
              fontSize: isMobile ? 15 : 17,
              fontWeight: 500,
              color: A.ink,
              paddingBottom: 4,
              textDecoration: 'none',
              overflow: 'hidden',
            }}
          >
            <span style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: hoverMehr ? '100%' : '2px',
              background: A.accent,
              transition: 'height 0.25s ease',
              zIndex: 0,
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>Mehr erfahren →</span>
          </Link>
        </div>
      </div>

      {/* Section header */}
      <div style={{
        padding: `${isMobile ? 32 : 48}px ${hPad}px 24px`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
      }}>
        <div style={{ gridColumn: contentColWide, display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <div style={{ fontSize: isMobile ? 20 : 30, fontWeight: 600, letterSpacing: '-0.01em' }}>
            Ausgewählte Projekte
          </div>
          <Link
            to="/projekte"
            onMouseEnter={() => setHoverAlle(true)}
            onMouseLeave={() => setHoverAlle(false)}
            style={{
              position: 'relative',
              display: 'inline-block',
              fontSize: 15,
              fontWeight: 500,
              color: A.ink,
              paddingBottom: 4,
              textDecoration: 'none',
              overflow: 'hidden',
            }}
          >
            <span style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: hoverAlle ? '100%' : '2px',
              background: A.accent,
              transition: 'height 0.25s ease',
              zIndex: 0,
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>Alle Projekte ansehen →</span>
          </Link>
        </div>
      </div>

      {/* Project feed */}
      {featured.map((p, i) => (
        <ProjectFeedItem
          key={p.id}
          proj={p}
          align={i % 2 === 0 ? 'L' : 'R'}
          large={i === 0}
        />
      ))}

      <Footer />
    </div>
  )
}
