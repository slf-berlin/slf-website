import { useState, useEffect } from 'react'
import { tokens as A } from '../tokens'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: hovered ? A.ink : A.bg,
        color: hovered ? A.bg : A.ink,
        border: `1px solid ${A.rule}`,
        borderRadius: 0,
        padding: '10px 16px',
        fontSize: 11,
        letterSpacing: '0.1em',
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1,8 6,3 11,8" />
      </svg>
      Nach oben
    </button>
  )
}
