import { useState, useEffect, useRef } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import projects from '../data/projects'
import { useWindowWidth } from '../hooks/useWindowWidth'

const PROSE_STYLES = `
.slf-prose p { margin: 0 0 1.2em; line-height: 1.8; }
.slf-prose p:last-child { margin-bottom: 0; }
.slf-prose h2 { font-size: 1.1em; font-weight: 500; margin: 1.6em 0 0.5em; letter-spacing: -0.01em; }
.slf-prose h3 { font-size: 1em; font-weight: 500; margin: 1.4em 0 0.4em; }
.slf-prose ul, .slf-prose ol { margin: 0 0 1.2em; padding-left: 1.4em; }
.slf-prose li { margin-bottom: 0.35em; line-height: 1.6; }
.slf-prose strong { font-weight: 500; }
.slf-prose a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
.slf-prose blockquote { margin: 1.4em 0; padding-left: 1.2em; border-left: 2px solid #e6e5e2; color: #6b6b6e; font-style: italic; }
@keyframes slf-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
.slf-img-skeleton {
  position: absolute; inset: 0;
  background: linear-gradient(100deg, #eceae4 25%, #f5f4ef 50%, #eceae4 75%);
  background-size: 200% 100%;
  animation: slf-shimmer 1.4s ease-in-out infinite;
}
.slf-prose img {
  max-width: 100%; height: auto; display: block; cursor: zoom-in; transition: opacity 0.18s;
}
.slf-prose img:not(.slf-loaded) {
  background: linear-gradient(100deg, #eceae4 25%, #f5f4ef 50%, #eceae4 75%);
  background-size: 200% 100%;
  animation: slf-shimmer 1.4s ease-in-out infinite;
}
.slf-prose img:hover { opacity: 0.8; }
@media (prefers-reduced-motion: reduce) { .slf-img-skeleton, .slf-prose img:not(.slf-loaded) { animation: none; } }
.slf-zoom-img { cursor: zoom-in; transition: opacity 0.18s; }
.slf-zoom-img:hover { opacity: 0.8; }
@keyframes slf-lb-in { from { opacity: 0; transform: scale(0.97) } to { opacity: 1; transform: scale(1) } }
.slf-lightbox-img { animation: slf-lb-in 0.18s ease; }
.slf-prose figure { margin: 0; }
.slf-prose figure img { margin: 0; }
.slf-prose figcaption { font-size: 13px; color: #6b6b6e; margin-top: 6px; line-height: 1.4; }
.slf-prose .slf-row { display: flex; gap: 24px; align-items: flex-start; margin: 1.6em 0; }
.slf-prose .slf-col-50 { flex: 1 1 0; min-width: 0; }
.slf-prose .slf-col-33 { flex: 1 1 0; min-width: 0; }
.slf-prose .slf-col-66 { flex: 2 1 0; min-width: 0; }
.slf-prose .slf-col-100 { flex: 1 0 100%; }
@media (max-width: 640px) { .slf-prose .slf-row { flex-direction: column; } .slf-prose .slf-row > * { width: 100% !important; } }
.slf-prose .slf-daten-heading { font-size: 17px; font-weight: 600; color: #0e0e10; margin: 2.6em 0 14px; line-height: 1; }
.slf-prose .slf-daten { margin: 0; display: grid; grid-template-columns: minmax(90px, 140px) 1fr; border-top: 1px solid #e6e5e2; }
.slf-prose .slf-daten dt { font-size: 16px; font-weight: 500; color: #6b6b6e; padding: 14px 16px 14px 0; margin: 0; }
.slf-prose .slf-daten dd { font-size: 16px; color: #0e0e10; padding: 14px 0; margin: 0; line-height: 1.4; overflow-wrap: break-word; }
@media (max-width: 640px) { .slf-prose .slf-daten { grid-template-columns: 1fr; } .slf-prose .slf-daten dt { padding: 14px 0 2px; } .slf-prose .slf-daten dd { font-size: 17px; padding: 0 0 14px; } }
`

// WordPress CDN images often embed a size suffix (e.g. -1024x683.jpg).
// Strip it to load the full-resolution original in the lightbox.
function wpFullSize(src) {
  return src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1')
}

// Remove dt/dd pairs where the dd value is empty or whitespace-only.
// Merge "Mehr Informationen" slf-rows into the preceding Projektdaten <dl>, auto-linking bare URLs.
// Remove slf-rows where every column after the first contains only whitespace.
function processContent(html) {
  let out = html.replace(/<dt>[^<]*<\/dt><dd>\s*<\/dd>/g, '');

  const buildMehrInfo = (colContent) => {
    const text = colContent.replace(/<[^>]+>/g, '').trim();
    if (!text) return null;
    let inner = colContent.replace(/^\s*<p>/, '').replace(/<\/p>\s*$/, '').trim();
    inner = inner.replace(/<br\s*\/?>\s*$/, '').trim();
    if (!/<a[\s>]/i.test(inner) && /^https?:\/\//.test(inner)) {
      inner = `<a href="${inner}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
    }
    return `<dt>Mehr Informationen</dt><dd>${inner}</dd>`;
  };

  // Case 1: "Mehr Informationen" row immediately after a </dl> → merge into it
  out = out.replace(
    /<\/dl>\s*<div class="slf-row"><div class="slf-col-50"><p>Mehr Informationen<\/p><\/div><div class="slf-col-50">([\s\S]*?)<\/div><\/div>/g,
    (match, colContent) => {
      const row = buildMehrInfo(colContent);
      return row ? `${row}</dl>` : '</dl>';
    }
  );

  // Case 2: standalone "Mehr Informationen" row (no preceding </dl>) → new <dl>
  out = out.replace(
    /<div class="slf-row"><div class="slf-col-50"><p>Mehr Informationen<\/p><\/div><div class="slf-col-50">([\s\S]*?)<\/div><\/div>/g,
    (match, colContent) => {
      const row = buildMehrInfo(colContent);
      return row ? `<dl class="slf-daten">${row}</dl>` : '';
    }
  );

  out = out.replace(/<div class="slf-row">((?:<div class="slf-col-\d+">[\s\S]*?<\/div>)+)<\/div>/g, (match, inner) => {
    const cols = [...inner.matchAll(/<div class="slf-col-\d+">([\s\S]*?)<\/div>/g)];
    const contentCols = cols.slice(1);
    const allEmpty = contentCols.length > 0 && contentCols.every(c => !c[1].trim());
    return allEmpty ? '' : match;
  });
  return out;
}

export default function ProjectDetail() {
  const { id } = useParams()
  const width = useWindowWidth()
  const isMobile = width < 768

  const [lightbox, setLightbox] = useState(null)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const proseRef = useRef(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  // Drop the shimmer background once each prose image has loaded — otherwise
  // it stays visible forever behind transparent PNGs.
  useEffect(() => {
    const root = proseRef.current
    if (!root) return
    const imgs = root.querySelectorAll('img')
    const cleanups = []
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('slf-loaded')
        return
      }
      const mark = () => img.classList.add('slf-loaded')
      img.addEventListener('load', mark)
      img.addEventListener('error', mark)
      cleanups.push(() => {
        img.removeEventListener('load', mark)
        img.removeEventListener('error', mark)
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [id])

  const idx = projects.findIndex(p => p.id === id)
  if (idx === -1) return <Navigate to="/projekte" replace />

  const project = projects[idx]
  const prev = idx > 0 ? projects[idx - 1] : null
  const next = idx < projects.length - 1 ? projects[idx + 1] : null

  const hPad = isMobile ? 20 : 56

  const metaRows = [
    { label: 'Ort', value: project.ort },
    { label: 'Auftraggebende', value: project.auftraggeber },
    { label: 'Fläche', value: project.flaeche },
  ].filter(row => row.value != null)

  const hasImage = !!project.image

  const backLink = (
    <Link
      to="/projekte"
      style={{
        fontSize: 13,
        color: A.mute,
        textDecoration: 'none',
      }}
    >
      ← Alle Projekte
    </Link>
  )

  return (
    <div style={base}>
      <style>{PROSE_STYLES}</style>
      <Nav />

      {/* Hero image — aligned to text column, touching the header; back link overlaid */}
      {hasImage ? (
        <div style={{ position: 'relative', padding: isMobile ? 0 : `0 ${hPad}px` }}>
          {isMobile && (
            <div style={{ padding: `4px ${hPad}px 6px` }}>
              {backLink}
            </div>
          )}
          {isMobile ? (
            <div style={{ position: 'relative', minHeight: heroLoaded ? 0 : 220 }}>
              {!heroLoaded && <div className="slf-img-skeleton" />}
              <img
                src={project.image}
                alt={project.titel}
                className="slf-zoom-img"
                onClick={() => setLightbox({ src: project.image, caption: null })}
                onLoad={() => setHeroLoaded(true)}
                onError={() => setHeroLoaded(true)}
                style={{ width: '100%', display: 'block', position: 'relative', opacity: heroLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
              />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '0 24px',
            }}>
              <div style={{ gridColumn: '3 / span 8', position: 'relative', minHeight: heroLoaded ? 0 : 360 }}>
                {!heroLoaded && <div className="slf-img-skeleton" />}
                <img
                  src={project.image}
                  alt={project.titel}
                  className="slf-zoom-img"
                  onClick={() => setLightbox({ src: project.image, caption: null })}
                  onLoad={() => setHeroLoaded(true)}
                  onError={() => setHeroLoaded(true)}
                  style={{ width: '100%', display: 'block', position: 'relative', opacity: heroLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
                />
              </div>
            </div>
          )}
          {!isMobile && (
            <div style={{ position: 'absolute', top: 20, left: hPad }}>
              {backLink}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: `20px ${hPad}px 0`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {backLink}
        </div>
      )}

      {/* Main grid */}
      <div style={{
        padding: isMobile ? '32px 20px 0' : '48px 56px 0',
        ...(isMobile ? {} : {
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '32px 24px',
        }),
      }}>

        {/* Section label */}
        {!isMobile && (
          <div style={{ gridColumn: '1 / span 1', gridRow: '1', paddingTop: 4 }}>
            <span style={{
              fontSize: 14,
              color: A.mute,
            }}>
              Projekt
            </span>
          </div>
        )}

        {/* Content column */}
        <div style={isMobile ? {} : { gridColumn: '3 / span 8', gridRow: '1' }}>

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? 26 : 38,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 8px',
            color: A.ink,
          }}>
            {project.titel}
          </h1>

          {project.ergebnis && (
            <div style={{
              display: 'inline-block',
              marginBottom: 12,
              fontSize: 16,
              color: A.mute,
              border: `1px solid ${A.rule}`,
              padding: '5px 12px',
            }}>
              {project.ergebnis}
            </div>
          )}

          {/* Subtitle */}
          {project.untertitel && (
            <p style={{
              fontSize: isMobile ? 16 : 18,
              color: A.mute,
              margin: '0 0 0',
              lineHeight: 1.5,
            }}>
              {project.untertitel}
            </p>
          )}

          {/* Structured metadata (from tokens — currently all null in WP data) */}
          {metaRows.length > 0 && (
            <div style={{ margin: '24px 0 32px' }}>
              {metaRows.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    padding: '16px 0',
                    gap: 24,
                  }}
                >
                  <span style={{
                    minWidth: 110,
                    fontSize: 13,
                    fontWeight: 600,
                    color: A.mute,
                    flexShrink: 0,
                  }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: 16, color: A.ink }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Prose content — Projektdaten block transformed into styled <dl> */}
          {project.content ? (
            <div
              ref={proseRef}
              className="slf-prose"
              style={{
                fontSize: isMobile ? 16 : 17,
                color: A.ink,
                lineHeight: 1.8,
                marginTop: metaRows.length > 0 ? 0 : 24,
              }}
              onClick={(e) => {
                if (e.target.tagName === 'IMG') {
                  const caption = e.target.closest('figure')?.querySelector('figcaption')?.textContent || null
                  setLightbox({ src: wpFullSize(e.target.src), caption })
                }
              }}
              dangerouslySetInnerHTML={{ __html: processContent(project.content) }}
            />
          ) : (
            <p style={{ fontSize: 17, color: A.ink, lineHeight: 1.8, marginTop: 24 }}>
              {project.beschreibung}
            </p>
          )}

        </div>
      </div>

      {/* Prev / Next navigation */}
      <div style={{
        padding: isMobile ? '32px 20px 72px' : '56px 56px 120px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        marginTop: 0,
      }}>
        <div>
          {prev && (
            <Link
              to={`/projekte/${prev.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{ fontSize: 13, color: A.mute, marginBottom: 8 }}>
                ← Vorheriges Projekt
              </div>
              <div style={{ fontSize: isMobile ? 16 : 17, color: A.ink, fontWeight: 500, letterSpacing: '-0.01em' }}>
                {prev.titel}
              </div>
            </Link>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          {next && (
            <Link
              to={`/projekte/${next.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{ fontSize: 13, color: A.mute, marginBottom: 8 }}>
                Nächstes Projekt →
              </div>
              <div style={{ fontSize: isMobile ? 16 : 17, color: A.ink, fontWeight: 500, letterSpacing: '-0.01em' }}>
                {next.titel}
              </div>
            </Link>
          )}
        </div>
      </div>

      <BackToTop />
      <Footer />

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 14, 16, 0.93)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 14,
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 30,
              cursor: 'pointer',
              lineHeight: 1,
              opacity: 0.65,
              padding: '4px 8px',
              borderRadius: 0,
            }}
            aria-label="Schließen"
          >
            ×
          </button>
          <img
            src={lightbox.src}
            alt=""
            className="slf-lightbox-img"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              display: 'block',
              cursor: 'default',
              background: '#fff',
            }}
          />
          {lightbox.caption && (
            <div style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              maxWidth: '60vw',
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              {lightbox.caption}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
