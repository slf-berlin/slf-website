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
    titel: 'Konzeptionell',
    beschreibung: 'Strategische Stadtplanung, Machbarkeitsstudien, Wettbewerbsteilnahmen und Partizipationsverfahren.',
  },
  {
    titel: 'Städtebau',
    beschreibung: 'Städtebauliche Entwürfe, Quartiersentwicklung und Gestaltungskonzepte für urbane Räume.',
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

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 88
  const vPadSmall = isMobile ? 40 : 88
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 8'
  const contentColWide = isMobile ? 'auto' : '3 / span 9'

  return (
    <div style={base}>
      <Nav />

      {/* Hero */}
      <div style={{ background: A.bg, paddingLeft: isMobile ? 12 : 36, paddingRight: isMobile ? 12 : 36 }}>
        <div style={{ position: 'relative' }}>
        <img
          src={heroBild}
          alt="Deckblatt — Quartiersentwicklung, Lageplan & Bebauungsplan"
          style={{ display: 'block', width: '100%', height: isMobile ? 280 : 620, objectFit: 'cover' }}
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
              style={{ flex: seg.flex, position: 'relative', cursor: 'default' }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(14,14,16,0.72)',
                opacity: hoveredLeistung === seg.li ? 1 : 0,
                transition: 'opacity 0.28s ease',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 24,
              }}>
                <div style={{ width: 28, height: 3, background: A.accent, marginBottom: 14 }} />
                <div style={{
                  fontSize: isMobile ? 17 : 22,
                  fontWeight: 400, color: '#fff',
                  letterSpacing: '-0.01em', textAlign: 'center',
                }}>
                  {LEISTUNGEN[seg.li].titel}
                </div>
                <div style={{
                  fontSize: isMobile ? 13 : 14,
                  color: 'rgba(255,255,255,0.65)',
                  marginTop: 10, lineHeight: 1.5,
                  textAlign: 'center', maxWidth: 200,
                }}>
                  {LEISTUNGEN[seg.li].beschreibung}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Intro */}
      <div style={{
        padding: `${vPad}px ${hPad}px ${isMobile ? 40 : 56}px`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 14, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          01 /<br />Das Büro
        </div>
        <div style={{ gridColumn: contentCol }}>
          <h1 style={{
            fontWeight: 400, lineHeight: 1.2,
            letterSpacing: '-0.015em', margin: 0,
            fontSize: isMobile ? 20 : 28,
          }}>
            Willkommen<br />
            bei STADT LAND FLUSS Städtebau und Stadtplanung PartGmbB!
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: A.mute,
            maxWidth: 640, marginTop: 28,
          }}>
            Wir verfügen über eine umfassende Erfahrung in der praxisorientierten Stadtplanung und im kontextuellen Städtebau.
          </p>
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: A.mute,
            maxWidth: 640, marginTop: 20,
          }}>
            Wir arbeiten integrativ, komplex, fachübergreifend sowie teamorientiert und engagieren uns für die Sicherung einer menschenwürdigen Umwelt.
          </p>
          <p style={{ marginTop: 20, fontSize: 18, color: A.mute, lineHeight: 1.55, maxWidth: 640 }}>
            Wir freuen uns auf spannende Projekte und weiterhin gute Zusammenarbeit in alten und neuen Konstellationen!
          </p>
        </div>
      </div>

      {/* Section header */}
      <div style={{
        padding: `${isMobile ? 32 : 48}px ${hPad}px 24px`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
        borderBottom: `1px solid ${A.rule}`,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 14, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          02 / Aktuell
        </div>
        <div style={{ gridColumn: contentColWide, display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 400, letterSpacing: '-0.01em' }}>
            Ausgewählte Projekte
          </div>
          <Link to="/projekte" style={{
            fontSize: 15,
            borderBottom: `2px solid ${A.accent}`,
            color: A.ink, paddingBottom: 2,
          }}>
            Alle Projekte ansehen →
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
        borderTop: `1px solid ${A.rule}`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 14, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          03 / Notiz
        </div>
        <div style={{ gridColumn: contentCol }}>
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
