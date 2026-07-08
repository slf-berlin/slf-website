import { useState } from 'react'
import { tokens as A } from '../tokens'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { ensureImageStyles } from './SmartImage'

ensureImageStyles()

const RATIO_MAP = {
  '16/10': '62.5%',
  '4/3': '75%',
  '3/2': '66.67%',
  '1/1': '100%',
}

export default function ProjectImage({ proj, ratio = '4/3', title, subtitle, ergebnis, themen, style = {} }) {
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const width = useWindowWidth()
  const paddingTop = RATIO_MAP[ratio] ?? '75%'
  const isPhoto = proj?.tone !== 'plan'
  const hasOverlay = Boolean(title || subtitle || ergebnis || (themen && themen.length))

  const titleSize = width < 640 ? 15 : width < 1024 ? 17 : 20
  const subtitleSize = width < 640 ? 12 : width < 1024 ? 13 : 15

  const stripeStyle = isPhoto
    ? { backgroundImage: `repeating-linear-gradient(135deg, #d8d5ce 0px, #d8d5ce 1px, #e8e6e0 1px, #e8e6e0 12px)` }
    : { backgroundImage: `repeating-linear-gradient(90deg, #c4c1b8 0px, #c4c1b8 1px, #e0ddd5 1px, #e0ddd5 8px)` }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: '100%', paddingTop, overflow: 'hidden', cursor: 'pointer', ...stripeStyle, ...style }}
    >
      {proj?.image && !loaded && <div className="slf-img-skeleton" />}
      {proj?.image && (
        <img
          src={proj.image}
          alt={proj.titel}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            opacity: loaded ? 1 : 0,
            transition: 'transform 0.4s ease, opacity 0.4s ease',
          }}
        />
      )}
      {/* accent overlay — only when there is hover text to reveal */}
      {hasOverlay && <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(243,241,227,0.92)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />}
      {/* hover content */}
      {hasOverlay && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          textAlign: 'center',
          gap: 4,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
        }}>
          {title && (
            <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em', color: A.ink }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: subtitleSize, fontWeight: 400, lineHeight: 1.3, color: A.ink }}>
              {subtitle}
            </div>
          )}
          {ergebnis && (
            <div style={{ fontSize: subtitleSize, fontWeight: 400, lineHeight: 1.3, color: A.ink }}>
              {ergebnis}
            </div>
          )}
          {themen && themen.length > 0 && (
            <div style={{
              marginTop: 6, fontSize: width < 640 ? 11 : 12, fontWeight: 400,
              lineHeight: 1.5, letterSpacing: '0.04em', color: A.mute,
            }}>
              {themen.join(' · ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
