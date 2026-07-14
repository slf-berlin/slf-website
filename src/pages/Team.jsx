import { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import { tokens as A, base } from '../tokens'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { ensureImageStyles } from '../components/SmartImage'
import { TEAM } from '../data/team'

ensureImageStyles()

// Image with a shimmer skeleton while loading. The img keeps its aspectRatio so
// the skeleton (absolute) fills the reserved box; both live in a relative parent.
function ImgWithSkeleton({ src, alt, style }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && <div className="slf-img-skeleton" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ ...style, position: 'relative', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />
    </>
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
            <div style={{
              fontSize: 14, color: A.mute,
              fontWeight: 600,
              marginBottom: 7,
            }}>
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

            <div style={{
              fontSize: 16, color: A.mute, marginTop: 7,
              lineHeight: 1.5, marginBottom: 22,
            }}>
              {member.ausbildung}
            </div>

            <div style={{ marginBottom: 20 }}>
              {member.cv.map(([jahre, text]) => (
                <div key={jahre} style={{
                  display: 'flex', gap: 16,
                  fontSize: 16, lineHeight: 1.65, color: A.mute,
                }}>
                  <span style={{
                    minWidth: 90, flexShrink: 0,
                    color: A.mute, fontSize: 15,
                  }}>
                    {jahre}
                  </span>
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
          src={member.photo}
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
        <div style={{
          fontSize: 20, fontWeight: 600,
          letterSpacing: '-0.005em', color: A.ink,
          lineHeight: 1.3,
        }}>
          {member.name}
        </div>
        <div style={{
          fontSize: 14, color: A.mute,
          marginTop: 5,
        }}>
          {member.rolle}
        </div>
      </div>
    </div>
  )
}

export default function Team() {
  const width = useWindowWidth()
  const isMobile = width < 768
  const [selected, setSelected] = useState(null)

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 88
  const cols = width < 640 ? 2 : width < 1024 ? 3 : 4

  return (
    <div style={base}>
      <Nav />

      <div style={{ padding: `${vPad}px ${hPad}px` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
          gap: 24,
          marginBottom: isMobile ? 40 : 60,
        }}>
          <div style={{ gridColumn: isMobile ? 'auto' : '3 / span 8' }}>
            <h1 style={{
              fontWeight: 600, fontSize: isMobile ? 26 : 36,
              letterSpacing: '-0.015em', margin: 0,
            }}>
              Das Team
            </h1>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
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

      <BackToTop />
      <Footer />
    </div>
  )
}
