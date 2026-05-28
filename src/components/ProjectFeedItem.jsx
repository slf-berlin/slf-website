import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tokens as A } from '../tokens'
import ProjectImage from './ProjectImage'
import { useWindowWidth } from '../hooks/useWindowWidth'

export default function ProjectFeedItem({ proj, align = 'L', large = false }) {
  const [hovered, setHovered] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 768

  const Img = (
    <div style={{ gridColumn: isMobile ? '1' : (align === 'L' ? '1 / span 9' : '4 / span 9') }}>
      <ProjectImage proj={proj} ratio={large ? '16/10' : '4/3'} title="Zum Projekt →" />
    </div>
  )

  const Txt = (
    <div style={{
      gridColumn: isMobile ? '1' : (align === 'L' ? '10 / span 3' : '1 / span 3'),
      alignSelf: 'end',
      paddingBottom: 6,
    }}>
      <div style={{
        fontSize: 12, color: A.mute,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <span>{proj.kategorie}</span>
        <span style={{ width: 18, height: 3, background: A.accent }} />
        <span>{proj.jahr}</span>
      </div>

      <h3 style={{
        fontSize: isMobile ? 18 : 22, fontWeight: 400, lineHeight: 1.15,
        letterSpacing: '-0.01em',
        margin: '12px 0 0',
        color: hovered ? A.accentDeep : A.ink,
        transition: 'color 0.18s ease',
      }}>
        {proj.titel}
      </h3>

      {proj.untertitel && (
        <div style={{ fontSize: 15, color: A.mute, marginTop: 6 }}>{proj.untertitel}</div>
      )}

      <div style={{
        marginTop: 10,
        fontSize: 12, color: A.accentDeep,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {proj.ort}
      </div>
    </div>
  )

  return (
    <Link
      to={`/projekte/${proj.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
        gap: isMobile ? 20 : 24,
        padding: isMobile ? '40px 20px' : '64px 56px',
        borderTop: `1px solid ${A.ruleSoft}`,
        cursor: 'pointer',
      }}>
        {(isMobile || align === 'L') ? <>{Img}{Txt}</> : <>{Txt}{Img}</>}
      </div>
    </Link>
  )
}
