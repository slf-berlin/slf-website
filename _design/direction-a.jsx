// Direction A — "Editorial Index"
// Refined version of the current site: large hero, vertical project feed with
// big images, neutral sans-serif, generous whitespace, hairline rules.
// Pure black & white. Mostly mirrors the current information architecture.

const A = {
  bg: '#ffffff',
  ink: '#0e0e10',
  mute: '#6b6b6e',
  rule: '#e6e5e2',
  ruleSoft: '#f1f0ed',
  accent: '#ccc8a6',        // SLF logo sand/khaki accent
  accentSoft: '#f3f1e3',    // very pale tint of the same hue
  accentDeep: '#8a8765',    // for hover/active text on light bg
  font: '"DIN Next LT Pro", "DIN Pro", "DIN", "D-DIN", "Barlow", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCondensed: '"DIN Next LT Pro Condensed", "DIN Condensed", "D-DIN Condensed", "Barlow Condensed", "DIN", "Barlow", sans-serif'
};

const aBase = {
  fontFamily: A.font,
  color: A.ink,
  background: A.bg,
  WebkitFontSmoothing: 'antialiased',
  letterSpacing: '-0.005em'
};

function ANav({ active }) {
  const items = ['Projekte', 'Büro', 'Kontakt'];
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      background: A.bg,
      borderBottom: `1px solid ${A.rule}`,
      padding: '10px 56px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <a href="#" style={{ display: 'inline-flex', alignItems: 'center', color: 'inherit' }}>
        <img
          src="SLF_Logo.svg"
          alt="Stadt Land Fluss — Städtebau und Stadtplanung PartG mbB"
          style={{ height: 88, width: 'auto', display: 'block' }} />
      </a>
      <nav style={{ display: 'flex', gap: 36, fontSize: 14, alignItems: 'center' }}>
        {items.map((it) =>
        <span key={it} style={{
          color: it === active ? A.ink : A.mute,
          borderBottom: it === active ? `2px solid ${A.accent}` : '2px solid transparent',
          paddingBottom: 4,
          fontWeight: it === active ? 500 : 400,
          letterSpacing: '0.01em'
        }}>{it}</span>
        )}
      </nav>
    </div>);

}

function AFooter() {
  return (
    <div style={{
      borderTop: `1px solid ${A.rule}`,
      padding: '48px 56px 36px',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32,
      fontSize: 13, lineHeight: 1.55, color: A.ink
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
          Stadt&nbsp;Land&nbsp;Fluss
        </div>
        <div style={{
          width: 32, height: 3, background: A.accent,
          margin: '12px 0 14px'
        }} />
        <div style={{ color: A.mute, marginTop: 4 }}>
          Städtebau und Stadtplanung PartG mbB
        </div>
        <div style={{ color: A.mute, marginTop: 14, maxWidth: 340 }}>
          Georg Börsch-Supan &nbsp;·&nbsp; Samir Hamzeh &nbsp;·&nbsp; Barbara Horst
        </div>
      </div>
      <div>
        <div style={{ color: A.mute, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Kontakt
        </div>
        Mahlower Straße 24<br />
        12049 Berlin<br />
        030 612 808 48<br />
        info@slf-berlin.de
      </div>
      <div>
        <div style={{ color: A.mute, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Navigation
        </div>
        Projekte<br />Büro<br />Kontakt<br />competitionline
      </div>
      <div>
        <div style={{ color: A.mute, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Rechtliches
        </div>
        Impressum<br />Datenschutzerklärung<br />
        <div style={{ marginTop: 22, color: A.mute, fontSize: 11 }}>
          © 2026
        </div>
      </div>
    </div>);

}

function AProjectFeedItem({ proj, align = 'L', large = false }) {
  // Alternating: 'L' = image left, text right; 'R' = inverse
  const Img =
  <div style={{ gridColumn: align === 'L' ? '1 / span 7' : '6 / span 7' }}>
      <Placeholder
      ratio={large ? '16/10' : '4/3'}
      tone={proj.id === 'forckenbeckstrasse' ? 'plan' : 'photo'}
      label={proj.id.replace(/-/g, ' ')}
      sublabel={proj.jahr} />
    
    </div>;

  const Txt =
  <div style={{
    gridColumn: align === 'L' ? '9 / span 4' : '1 / span 4',
    alignSelf: 'end',
    paddingBottom: 6
  }}>
      <div style={{
      fontSize: 11, color: A.mute,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      display: 'flex', gap: 12, alignItems: 'center'
    }}>
        <span>{proj.kategorie}</span>
        <span style={{ width: 18, height: 2, background: A.accent }} />
        <span>{proj.jahr}</span>
      </div>
      <h3 style={{
      fontSize: 26, fontWeight: 500, lineHeight: 1.18,
      letterSpacing: '-0.005em',
      margin: '12px 0 0'
    }}>
        {proj.titel}
      </h3>
      {proj.untertitel &&
    <div style={{ fontSize: 15, color: A.mute, marginTop: 4 }}>
          {proj.untertitel}
        </div>
    }
      {proj.beschreibung &&
    <p style={{
      fontSize: 14, lineHeight: 1.55, color: A.ink,
      margin: '18px 0 0', maxWidth: 380,
      textWrap: 'pretty'
    }}>
          {proj.beschreibung}
        </p>
    }
      <div style={{
      marginTop: 22, paddingTop: 14,
      borderTop: `1px solid ${A.rule}`,
      display: 'flex', justifyContent: 'space-between',
      fontSize: 12, color: A.mute
    }}>
        <span>{proj.ort}</span>
        <span>{proj.flaeche}</span>
      </div>
      <div style={{ marginTop: 22, fontSize: 13 }}>
        <span style={{
          borderBottom: `2px solid ${A.accent}`,
          paddingBottom: 3
        }}>
          Zum Projekt →
        </span>
      </div>
    </div>;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
      gap: 24, padding: '64px 56px',
      borderTop: `1px solid ${A.ruleSoft}`
    }}>
      {align === 'L' ? <>{Img}{Txt}</> : <>{Txt}{Img}</>}
    </div>);

}

function AHome() {
  const featured = window.PROJEKTE.slice(0, 6);
  return (
    <div style={aBase} data-screen-label="A · Willkommen">
      <ANav active="Projekte" />

      {/* Hero image — full-bleed cover */}
      <div style={{ position: 'relative', background: A.bg }}>
        <img
          src="deckblatt-homepage.jpg"
          alt="Deckblatt — Quartiersentwicklung, Lageplan & Bebauungsplan"
          style={{ display: 'block', width: '100%', height: 'auto' }} />
        <div style={{
          position: 'absolute', left: 56, bottom: 24,
          background: 'rgba(255,255,255,0.92)',
          padding: '8px 14px',
          fontSize: 11, color: A.ink,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          backdropFilter: 'blur(4px)',
          display: 'flex', gap: 14, alignItems: 'center'
        }}>
          <span>Konzept · Lageplan · B-Plan</span>
          <span style={{ width: 14, height: 2, background: A.accent }} />
          <span style={{ color: A.mute }}>SLF · Berlin 2024</span>
        </div>
      </div>

      {/* Intro */}
      <div style={{
        padding: '88px 56px 56px',
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24
      }}>
        <div style={{
          gridColumn: '1 / span 1',
          fontSize: 11, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          fontWeight: 500
        }}>
          01 / Willkommen
        </div>
        <div style={{ gridColumn: '3 / span 8' }}>
          <h1 style={{
            fontWeight: 400, lineHeight: 1.06,
            letterSpacing: '-0.015em', margin: 0, fontSize: "30px"
          }}>
            Praxisorientierte Stadtplanung und kontextueller
            Städtebau&nbsp;— seit über dreißig Jahren aus Berlin.
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.55, color: A.mute,
            maxWidth: 640, marginTop: 28
          }}>
            Wir arbeiten integrativ, komplex, fachübergreifend und teamorientiert.
            Unser Aufgabenspektrum umfasst strategische Stadtplanung, Bauleitplanung,
            Quartiersentwicklung, städtebauliche Machbarkeitsstudien,
            Wettbewerbsteilnahmen und Partizipationsverfahren.
          </p>
          <div style={{
            marginTop: 36, display: 'flex', gap: 36,
            fontSize: 12, color: A.mute,
            letterSpacing: '0.06em', textTransform: 'uppercase'
          }}>
            <span>Berlin</span>
            <span>gegr. 1992</span>
            <span>PartG mbB</span>
            <span>3 Partner:innen</span>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{
        padding: '88px 56px 24px',
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24,
        borderBottom: `1px solid ${A.rule}`
      }}>
        <div style={{
          gridColumn: '1 / span 1',
          fontSize: 11, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          fontWeight: 500
        }}>
          02 / Aktuell
        </div>
        <div style={{ gridColumn: '3 / span 9' }}>
          <div style={{ fontSize: 34, fontWeight: 400, letterSpacing: '-0.01em' }}>
            Ausgewählte Projekte
          </div>
          <div style={{ color: A.mute, marginTop: 6, fontSize: 14 }}>
            Eine Auswahl laufender und kürzlich abgeschlossener Arbeiten.
            <span style={{ marginLeft: 12, borderBottom: `2px solid ${A.accent}`, color: A.ink, paddingBottom: 2 }}>
              Alle Projekte ansehen →
            </span>
          </div>
        </div>
      </div>

      {/* Feed */}
      {featured.map((p, i) =>
      <AProjectFeedItem
        key={p.id}
        proj={p}
        align={i % 2 === 0 ? 'L' : 'R'}
        large={i === 0} />

      )}

      {/* Note */}
      <div style={{
        padding: '88px 56px',
        borderTop: `1px solid ${A.rule}`,
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24
      }}>
        <div style={{
          gridColumn: '1 / span 1',
          fontSize: 11, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          fontWeight: 500
        }}>
          03 / Notiz
        </div>
        <div style={{ gridColumn: '3 / span 8' }}>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: A.ink, margin: 0, maxWidth: 680 }}>
            Nach mehr als 30 Jahren hat <em>J. Miller Stevens</em> das Büro an
            Georg Börsch-Supan, Samir Hamzeh und Barbara Horst übergeben.
            J. Miller Stevens wird uns weiterhin mit seinem umfangreichen
            Erfahrungsschatz bei der Projektarbeit unterstützen.
          </p>
        </div>
      </div>

      <AFooter />
    </div>);

}

function AProjekte() {
  return (
    <div style={aBase} data-screen-label="A · Projekte">
      <ANav active="Projekte" />

      {/* Header */}
      <div style={{
        padding: '88px 56px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24,
        borderBottom: `1px solid ${A.rule}`
      }}>
        <div style={{
          gridColumn: '1 / span 1',
          fontSize: 11, color: A.accentDeep,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          fontWeight: 500
        }}>
          Projekte
        </div>
        <div style={{ gridColumn: '3 / span 7' }}>
          <h1 style={{ fontSize: 52, fontWeight: 400, letterSpacing: '-0.015em', margin: 0, lineHeight: 1.05 }}>
            Projekte
          </h1>
          <p style={{ fontSize: 15, color: A.mute, maxWidth: 480, marginTop: 18 }}>
            Strategische Planung, Bauleitplanung, Quartiersentwicklung,
            Wettbewerbe und Partizipation — chronologisch sortiert.
          </p>
        </div>
        <div style={{ gridColumn: '11 / span 2', alignSelf: 'end', textAlign: 'right', fontSize: 12, color: A.mute }}>
          {window.PROJEKTE.length} Einträge
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        padding: '20px 56px',
        borderBottom: `1px solid ${A.rule}`,
        display: 'flex', gap: 28, alignItems: 'center',
        fontSize: 13, color: A.mute
      }}>
        <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filter</span>
        {['Alle', 'Wettbewerb', 'Bauleitplanung', 'Rahmenplan', 'Quartier', 'Studie'].map((f, i) =>
        <span key={f} style={{
          color: i === 0 ? A.ink : A.mute,
          borderBottom: i === 0 ? `2px solid ${A.accent}` : 'none',
          paddingBottom: 3,
          fontWeight: i === 0 ? 500 : 400
        }}>
            {f}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12 }}>Sortieren: <strong style={{ color: A.ink, fontWeight: 500 }}>Jahr ↓</strong></span>
      </div>

      {/* Grid */}
      <div style={{
        padding: '48px 56px 72px',
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '72px 40px'
      }}>
        {window.PROJEKTE.map((p) =>
        <div key={p.id}>
            <Placeholder ratio="4/3" tone={p.id === 'forckenbeckstrasse' || p.id === 'iek-berlin' ? 'plan' : 'photo'} label={p.id} />
            <div style={{
            marginTop: 18, display: 'flex', justifyContent: 'space-between',
            fontSize: 11, color: A.mute, letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
              <span>{p.kategorie}</span>
              <span>{p.jahr}</span>
            </div>
            <h3 style={{
            fontSize: 24, fontWeight: 500, lineHeight: 1.2,
            letterSpacing: '0', margin: '10px 0 0'
          }}>
              {p.titel}
            </h3>
            {p.untertitel &&
          <div style={{ fontSize: 15, color: A.mute, marginTop: 3 }}>
                {p.untertitel}
              </div>
          }
            <div style={{
            marginTop: 14, paddingTop: 12,
            borderTop: `1px solid ${A.ruleSoft}`,
            display: 'flex', justifyContent: 'space-between',
            fontSize: 12, color: A.mute
          }}>
              <span>{p.ort}</span>
              <span>{p.flaeche}</span>
            </div>
          </div>
        )}
      </div>

      <AFooter />
    </div>);

}

window.AHome = AHome;
window.AProjekte = AProjekte;