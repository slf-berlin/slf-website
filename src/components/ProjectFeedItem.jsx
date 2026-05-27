import { useState } from 'react'
import { tokens as A } from '../tokens'
import ProjectImage from './ProjectImage'
import { useWindowWidth } from '../hooks/useWindowWidth'

export default function ProjectFeedItem({ proj, align = 'L', large = false }) {
  const [ctaHovered, setCtaHovered] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 768

  const Img = (
    <div style={{ gridColumn: isMobile ? '1' : (align === 'L' ? '1 / span 7' : '6 / span 7') }}>
      <ProjectImage proj={proj} ratio={large ? '16/10' : '4/3'} />
    </div>
  )

  const Txt = (
    <div style={{
      gridColumn: isMobile ? '1' : (align === 'L' ? '9 / span 4' : '1 / span 4'),
      alignSelf: 'end',
      paddingBottom: 6,
    }}>
      <div style={{
        fontSize: 11, color: A.mute,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <span>{proj.kategorie}</span>
        <span style={{ width: 18, height: 2, background: A.accent }} />
        <span>{proj.jahr}</span>
      </div>

      <h3 style={{
        fontSize: isMobile ? 22 : 26, fontWeight: 500, lineHeight: 1.18,
        letterSpacing: '-0.005em',
        margin: '12px 0 0',
      }}>
        {proj.titel}
      </h3>

      {proj.untertitel && (
        <div style={{ fontSize: 15, color: A.mute, marginTop: 4 }}>{proj.untertitel}</div>
      )}

      {proj.beschreibung && (
        <p style={{
          fontSize: 14, lineHeight: 1.55, color: A.ink,
          margin: '18px 0 0', maxWidth: 380,
        }}>
          {proj.beschreibung}
        </p>
      )}

      <div style={{
        marginTop: 22,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, color: A.mute,
      }}>
        <span>{proj.ort}</span>
        <span>{proj.flaeche}</span>
      </div>

      <div style={{ marginTop: 22, fontSize: 13 }}>
        <span
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          style={{
            borderBottom: `2px solid ${ctaHovered ? A.accentDeep : A.accent}`,
            paddingBottom: 3,
            color: ctaHovered ? A.ink : A.mute,
            cursor: 'pointer',
            transition: 'border-color 0.15s ease, color 0.15s ease',
          }}
        >
          Zum Projekt →
        </span>
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
      gap: isMobile ? 20 : 24,
      padding: isMobile ? '40px 20px' : '64px 56px',
      borderTop: `1px solid ${A.ruleSoft}`,
    }}>
      {(isMobile || align === 'L') ? <>{Img}{Txt}</> : <>{Txt}{Img}</>}
    </div>
  )
}
