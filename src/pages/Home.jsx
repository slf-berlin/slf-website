import { Link } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProjectFeedItem from '../components/ProjectFeedItem'
import projects from '../data/projects'
import heroBild from '../assets/deckblatt-homepage-v3.jpg'
import { useWindowWidth } from '../hooks/useWindowWidth'

const featured = projects.slice(0, 6)

export default function Home() {
  const width = useWindowWidth()
  const isMobile = width < 768

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
      <div style={{ position: 'relative', background: A.bg }}>
        <img
          src={heroBild}
          alt="Deckblatt — Quartiersentwicklung, Lageplan & Bebauungsplan"
          style={{ display: 'block', width: '100%', height: isMobile ? 280 : 620, objectFit: 'cover' }}
        />
      </div>

      {/* Intro */}
      <div style={{
        padding: `${vPad}px ${hPad}px ${isMobile ? 40 : 56}px`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 11, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          01 / Willkommen
        </div>
        <div style={{ gridColumn: contentCol }}>
          <h1 style={{
            fontWeight: 400, lineHeight: 1.06,
            letterSpacing: '-0.015em', margin: 0,
            fontSize: isMobile ? 24 : 30,
          }}>
            Praxisorientierte Stadtplanung und kontextueller
            Städtebau&nbsp;— seit über dreißig Jahren aus Berlin.
          </h1>
          <p style={{
            fontSize: isMobile ? 15 : 17, lineHeight: 1.55, color: A.mute,
            maxWidth: 640, marginTop: 28,
          }}>
            Wir arbeiten integrativ, komplex, fachübergreifend und teamorientiert.
            Unser Aufgabenspektrum umfasst strategische Stadtplanung, Bauleitplanung,
            Quartiersentwicklung, städtebauliche Machbarkeitsstudien,
            Wettbewerbsteilnahmen und Partizipationsverfahren.
          </p>
          <div style={{
            marginTop: 36, display: 'flex', gap: isMobile ? 20 : 36, flexWrap: 'wrap',
            fontSize: 12, color: A.mute,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span>Berlin</span>
            <span>gegr. 1992</span>
            <span>PartG mbB</span>
            <span>3 Partner:innen</span>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div style={{
        padding: `${vPadSmall}px ${hPad}px 24px`,
        display: 'grid', gridTemplateColumns: gridCols, gap: 24,
        borderBottom: `1px solid ${A.rule}`,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 11, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          02 / Aktuell
        </div>
        <div style={{ gridColumn: contentColWide }}>
          <div style={{ fontSize: isMobile ? 26 : 34, fontWeight: 400, letterSpacing: '-0.01em' }}>
            Ausgewählte Projekte
          </div>
          <div style={{ color: A.mute, marginTop: 6, fontSize: 14 }}>
            Eine Auswahl laufender und kürzlich abgeschlossener Arbeiten.{' '}
            <Link to="/projekte" style={{
              marginLeft: isMobile ? 0 : 12,
              display: isMobile ? 'inline-block' : 'inline',
              marginTop: isMobile ? 6 : 0,
              borderBottom: `2px solid ${A.accent}`,
              color: A.ink, paddingBottom: 2,
            }}>
              Alle Projekte ansehen →
            </Link>
          </div>
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
          fontSize: 11, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          03 / Notiz
        </div>
        <div style={{ gridColumn: contentCol }}>
          <p style={{ fontSize: isMobile ? 16 : 19, lineHeight: 1.5, color: A.ink, margin: 0, maxWidth: 680 }}>
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
