import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProjectFeedItem from '../components/ProjectFeedItem'
import projects from '../data/projects'
import heroBild from '../assets/deckblatt-homepage-v3.jpg'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { usePageMeta } from '../hooks/usePageMeta'

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

// Les trois fragments forment une phrase continue lue en travers du hero,
// un fragment par bande : Idee → Konzept/Entwurf → Umsetzung.
const HERO_PHRASEN = [
  'Von der Idee und dem Leitbild …',
  '… über das Konzept und den Entwurf …',
  '… bis zur Umsetzung.',
]

// Plays the hero phrase reveal once per full page load — not on client-side
// route changes. Same pattern as logoIntroDone in Nav.jsx: read in render
// (pure), flipped in an effect so StrictMode's double-invoke is safe.
let heroIntroDone = false

// Balayage kaki clair : un bloc A.accentSoft balaie la plaque de gauche à
// droite (scaleX 0→1 origin left, puis 1→0 origin right) et « dépose » le
// texte derrière lui. Séquentiel bande 1 → 2 → 3, la phrase se lit en travers.
// Sans la classe --intro (navigation client, reduced motion) : texte visible,
// bloc replié (styles inline par défaut), aucune animation.
const HERO_STYLES = `
@media (prefers-reduced-motion: no-preference) {
  .slf-hero--intro .slf-hero-swipe { animation: slfHeroSwipe 0.9s cubic-bezier(0.45, 0, 0.25, 1) both; }
  .slf-hero--intro .slf-hero-text { animation: slfHeroText 0.9s linear both; }
  .slf-hero--intro .slf-hero-seg-1 .slf-hero-swipe, .slf-hero--intro .slf-hero-seg-1 .slf-hero-text { animation-delay: 0.3s; }
  .slf-hero--intro .slf-hero-seg-2 .slf-hero-swipe, .slf-hero--intro .slf-hero-seg-2 .slf-hero-text { animation-delay: 0.85s; }
  .slf-hero--intro .slf-hero-seg-3 .slf-hero-swipe, .slf-hero--intro .slf-hero-seg-3 .slf-hero-text { animation-delay: 1.4s; }
}
@keyframes slfHeroSwipe {
  0%   { transform: scaleX(0); transform-origin: left center; }
  45%  { transform: scaleX(1); transform-origin: left center; }
  55%  { transform: scaleX(1); transform-origin: right center; }
  100% { transform: scaleX(0); transform-origin: right center; }
}
@keyframes slfHeroText {
  0%, 50%  { opacity: 0; }
  60%, 100% { opacity: 1; }
}
`

export default function Home() {
  usePageMeta() // titre + description par défaut (page d'accueil)
  const width = useWindowWidth()
  const isMobile = width < 768
  const [hoverMehr, setHoverMehr] = useState(false)
  const [hoverAlle, setHoverAlle] = useState(false)
  const [hoveredSeg, setHoveredSeg] = useState(null)
  const [playHeroIntro] = useState(() => !heroIntroDone)
  useEffect(() => { heroIntroDone = true }, [])

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 112
  const vPadSmall = isMobile ? 40 : 112
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 8'
  const contentColWide = isMobile ? 'auto' : '3 / span 9'

  // The hero image keeps its natural aspect ratio (height:auto, no objectFit:cover)
  // so it is NEVER cropped — cropping would shift the visible strips out from under
  // the fixed-percentage overlay zones. The relative wrapper sizes itself to the image,
  // so the inset:0 overlay matches the image box exactly at any screen width.
  // v3 composite is 2110×1423 (3 image strips + 2 white gaps).
  const contentWidth = Math.min(width, 1400)

  // Each image strip ≈ 31.7% of the v3 composite. Size the phrase so the longest
  // fragment ("… über das Konzept und den Entwurf …") fits on ≤ 2 lines
  // (~22 chars/line). D-DIN char width ≈ 0.52em. Wrapping is allowed, so this
  // only sets an upper bound.
  const heroPad = hPad * 2
  const platePad = isMobile ? 8 : 14
  const segContentWidth = (contentWidth - heroPad) * 0.3166 - platePad * 2
  const phraseFontSize = Math.min(isMobile ? 13 : 22, Math.max(9, Math.floor(segContentWidth / (22 * 0.52))))

  return (
    <div style={base}>
      <Nav />

      {/* Hero */}
      <div style={{ background: A.bg, paddingLeft: hPad, paddingRight: hPad }}>
        <style>{HERO_STYLES}</style>
        <div style={{ position: 'relative' }}>
        <img
          src={heroBild}
          alt="Deckblatt — Quartiersentwicklung, Lageplan & Bebauungsplan"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        <div
          className={'slf-hero' + (playHeroIntro ? ' slf-hero--intro' : '')}
          style={{ position: 'absolute', inset: 0, display: 'flex' }}
        >
          {[
            // Measured against the v3 composite (2110px wide): 3 image strips + 2 gaps.
            { phrase: 0, flex: '0 0 31.66%' },
            { gap: true, flex: '0 0 2.42%' },
            { phrase: 1, flex: '0 0 31.75%' },
            { gap: true, flex: '0 0 2.37%' },
            { phrase: 2, flex: '1' },
          ].map((seg, i) => seg.gap ? (
            <div key={i} style={{ flex: seg.flex, pointerEvents: 'none' }} />
          ) : (
            <div
              key={i}
              className={`slf-hero-seg-${seg.phrase + 1}`}
              onMouseEnter={isMobile ? undefined : () => setHoveredSeg(seg.phrase)}
              onMouseLeave={isMobile ? undefined : () => setHoveredSeg(null)}
              style={{ flex: seg.flex, position: 'relative' }}
            >
              {/* Plaque — the light-khaki block sweeps across it and leaves the
                  phrase fragment behind (see HERO_STYLES). Hover: the plate
                  tints with the same light khaki and an accent line slides in
                  along its bottom edge. */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                padding: platePad,
                background: hoveredSeg === seg.phrase ? A.accentSoft : 'rgba(255,255,255,0.9)',
                transition: 'background 0.25s ease',
                overflow: 'hidden',
              }}>
                <div className="slf-hero-text" style={{
                  fontSize: phraseFontSize,
                  fontWeight: 500, color: A.ink,
                  letterSpacing: '-0.01em', lineHeight: 1.35,
                }}>
                  {HERO_PHRASEN[seg.phrase]}
                </div>
                <div className="slf-hero-swipe" style={{
                  position: 'absolute', inset: 0,
                  background: A.accentSoft,
                  transform: 'scaleX(0)',
                }} />
                <div style={{
                  position: 'absolute', left: 0, bottom: 0,
                  height: 3, background: A.accent,
                  width: hoveredSeg === seg.phrase ? '100%' : '0%',
                  transition: 'width 0.25s ease',
                }} />
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
              flexShrink: 0,
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
            <span style={{ position: 'relative', zIndex: 1, whiteSpace: 'nowrap' }}>Alle Projekte ansehen →</span>
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
