import { useState } from 'react'
import { tokens as A } from '../tokens'

const RATIO_MAP = {
  '16/10': '62.5%',
  '4/3': '75%',
  '3/2': '66.67%',
  '1/1': '100%',
}

export default function ProjectImage({ proj, ratio = '4/3', style = {} }) {
  const [hovered, setHovered] = useState(false)
  const paddingTop = RATIO_MAP[ratio] ?? '75%'
  const isPhoto = proj?.tone !== 'plan'

  const stripeStyle = isPhoto
    ? { backgroundImage: `repeating-linear-gradient(135deg, #d8d5ce 0px, #d8d5ce 1px, #e8e6e0 1px, #e8e6e0 12px)` }
    : { backgroundImage: `repeating-linear-gradient(90deg, #c4c1b8 0px, #c4c1b8 1px, #e0ddd5 1px, #e0ddd5 8px)` }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: '100%', paddingTop, overflow: 'hidden', ...stripeStyle, ...style }}
    >
      {proj?.image && (
        <img
          src={proj.image}
          alt={proj.titel}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.18)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: 12, bottom: 10,
        fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: isPhoto ? '#fff' : A.ink,
        background: isPhoto ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
        padding: '3px 7px',
      }}>
        {proj?.id?.replace(/-/g, ' ')} · {proj?.jahr}
      </div>
    </div>
  )
}
