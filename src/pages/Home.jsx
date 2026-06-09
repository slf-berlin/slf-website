import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProjectFeedItem from '../components/ProjectFeedItem'
import projects from '../data/projects'
import heroBild from '../assets/deckblatt-homepage-v3.jpg'
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
    titel: 'Quartiersentwicklung',
    beschreibung: 'Strategische Stadtentwicklung, Machbarkeitsstudien, integrierte Konzepte und Partizipationsverfahren.',
  },
  {
    titel: 'Städtebau',
    beschreibung: 'Städtebauliche Entwürfe, Rahmenplanungen und Gestaltungskonzepte für urbane Räume.',
  },
  {
    titel: 'Bauleitplanung',
    beschreibung: 'Flächennutzungspläne, Bebauungspläne und formelle Planungsverfahren nach BauGB.',
  },
]

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

  // Hero scales proportionally so objectFit:cover never crops the sides (which misaligns hover segments)
  const heroContainerWidth = width - 2 * hPad
  const heroHeight = Math.min(isMobile ? 420 : 660, Math.round(heroContainerWidth * (1423 / 2110)))

  // Compute overlay title font size to fit "Quartiersentwicklung" (20 chars) on one line
  const heroPad = hPad * 2
  const overlayPad = isMobile ? 16 : 48
  const segContentWidth = (width - heroPad) * 0.3164 - overlayPad
  // D-DIN char width ≈ 0.52em for this condensed font
  const titleFontSize = Math.min(isMobile ? 15 : 28, Math.max(9, Math.floor(segContentWidth / (20 * 0.52))))
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
          style={{ display: 'block', width: '100%', height: heroHeight, objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {[
            { li: 0, flex: '0 0 31.64%' },
            { gap: true, flex: '0 0 2.43%' },
            { li: 1, flex: '0 0 31.79%' },
            { gap: true, flex: '0 0 2.36%' },
            { li: 2, flex: '1' },
          ].map((seg, i) => seg.gap ? (
            <div key={i} style={{ flex: seg.flex, pointerEvents: 'none' }} />
          ) : (
            <div
              key={i}
              onMouseEnter={() => setHoveredLeistung(seg.li)}
              onMouseLeave={() => setHoveredLeistung(null)}
              style={{ flex: seg.flex, position: 'relative', cursor: 'default', overflow: 'hidden' }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(14,14,16,0.72)',
                opacity: hoveredLeistung === seg.li ? 1 : 0,
                transition: 'opacity 0.28s ease',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: isMobile ? 8 : 24,
              }}>
                <div style={{ width: 32, height: 3, background: A.accent, marginBottom: isMobile ? 10 : 18 }} />
                <div style={{
                  fontSize: titleFontSize,
                  fontWeight: 600, color: '#fff',
                  letterSpacing: '-0.02em', textAlign: 'center',
                  lineHeight: 1.2, whiteSpace: 'nowrap',
                }}>
                  {LEISTUNGEN[seg.li].titel}
                </div>
                {showDesc && (
                  <div style={{
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.82)',
                    marginTop: 14, lineHeight: 1.55,
                    textAlign: 'center', maxWidth: 240,
                  }}>
                    {LEISTUNGEN[seg.li].beschreibung}
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
            Städtebau und Stadtplanung PartGmbB!
          </div>
          <p style={{
            fontSize: isMobile ? 17 : 21, lineHeight: 1.75, color: A.ink,
            maxWidth: 640, marginTop: 32,
          }}>
            Wir verfügen über eine umfassende Erfahrung in der praxisorientierten Stadtplanung und im kontextuellen Städtebau.
          </p>
          <p style={{
            fontSize: isMobile ? 17 : 21, lineHeight: 1.75, color: A.ink,
            maxWidth: 640, marginTop: 20,
          }}>
            Wir arbeiten integrativ, komplex, fachübergreifend sowie teamorientiert und engagieren uns für die Sicherung einer menschenwürdigen Umwelt.
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

      {/* Notiz */}
      <div style={{
        padding: `${vPad}px ${hPad}px`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
      }}>
        <div style={{ gridColumn: contentCol }}>
          <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 16 }}>
            Notiz
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.5, color: A.ink, margin: 0, maxWidth: 680 }}>
            Nach mehr als 30 Jahren hat <em>J. Miller Stevens</em> das Büro an
            Georg Börsch-Supan, Samir Hamzeh und Barbara Horst übergeben.
            J. Miller Stevens wird uns weiterhin mit seinem umfangreichen
            Erfahrungsschatz bei der Projektarbeit unterstützen.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
