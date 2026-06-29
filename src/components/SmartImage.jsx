import { useState } from 'react'

// Shared spinner keyframes — injected once.
let stylesInjected = false
export function ensureImageStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
@keyframes slf-spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
.slf-img-skeleton {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: #f5f4ef;
}
.slf-img-skeleton::after {
  content: '';
  width: 28px; height: 28px;
  border: 3px solid #e6e5e2;
  border-top-color: #ccc8a6;
  border-radius: 50%;
  animation: slf-spin 0.8s linear infinite;
}
@media (prefers-reduced-motion: reduce) { .slf-img-skeleton::after { animation: none; } }
`
  document.head.appendChild(el)
}

/**
 * Image with a loading skeleton (shimmer) that fades out once the image loads.
 * Props mirror <img> — pass src, alt, style, onClick, className, etc.
 * `wrapperStyle` styles the positioning wrapper (defaults to filling its parent).
 */
export default function SmartImage({ src, alt = '', style = {}, wrapperStyle = {}, onClick, className, fit = 'cover', ...rest }) {
  ensureImageStyles()
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...wrapperStyle }}>
      {!loaded && <div className="slf-img-skeleton" />}
      {src && (
        <img
          src={src}
          alt={alt}
          className={className}
          onClick={onClick}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: fit,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            ...style,
          }}
          {...rest}
        />
      )}
    </div>
  )
}
