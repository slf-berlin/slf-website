// Direction B — "Archive Grid"
// Sticky left rail + dense right column. Hanken Grotesk + JetBrains Mono meta.
// Pure B&W. Information-dense but breathing. Index reads as a typographic table.

const B = {
  bg: '#ffffff',
  ink: '#0b0b0c',
  mute: '#7a7a7d',
  rule: '#dedcd7',
  ruleSoft: '#efeeea',
  sans: '"Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
};

const bBase = {
  fontFamily: B.sans,
  color: B.ink,
  background: B.bg,
  WebkitFontSmoothing: 'antialiased',
};

function BRail({ active }) {
  const items = ['Projekte', 'Büro', 'Kontakt', 'Publikationen'];
  return (
    <aside style={{
      position: 'sticky', top: 0, alignSelf: 'flex-start',
      width: 280, flexShrink: 0,
      borderRight: `1px solid ${B.rule}`,
      padding: '40px 32px 32px',
      height: '100%',
      display: 'flex', flexDirection: 'column', gap: 28,
      boxSizing: 'border-box',
    }}>
      {/* Wordmark */}
      <div>
        <div style={{
          fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05,
        }}>
          Stadt<br/>Land<br/>Fluss
        </div>
        <div style={{
          fontFamily: B.mono, fontSize: 10, color: B.mute,
          marginTop: 14, letterSpacing: '0.02em', lineHeight: 1.5,
        }}>
          STÄDTEBAU &amp;<br/>STADTPLANUNG<br/>PartG mbB
        </div>
      </div>

      <div style={{ height: 1, background: B.rule }} />

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
        {items.map((it) => (
          <div key={it} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '4px 0',
            color: it === active ? B.ink : B.mute,
            fontWeight: it === active ? 600 : 400,
          }}>
            <span>{it}</span>
            <span style={{ fontFamily: B.mono, fontSize: 10, opacity: 0.55 }}>
              {it === active ? '●' : '○'}
            </span>
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Contact (mono) */}
      <div style={{ fontFamily: B.mono, fontSize: 11, lineHeight: 1.65, color: B.ink }}>
        <div style={{ color: B.mute, fontSize: 9, letterSpacing: '0.1em', marginBottom: 8 }}>
          KONTAKT
        </div>
        Mahlower Straße 24<br/>
        12049 Berlin DE<br/>
        <br/>
        T&nbsp; +49 30 612 808 48<br/>
        E&nbsp; info@slf-berlin.de
      </div>

      <div style={{
        fontFamily: B.mono, fontSize: 9, color: B.mute,
        letterSpacing: '0.08em',
      }}>
        © 2026 — Impressum · Datenschutz
      </div>
    </aside>
  );
}

function BHome() {
  const featured = window.PROJEKTE.slice(0, 4);
  return (
    <div style={{ ...bBase, display: 'flex', minHeight: '100%' }} data-screen-label="B · Willkommen">
      <BRail active="Projekte" />

      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Top meta bar */}
        <div style={{
          padding: '20px 48px',
          borderBottom: `1px solid ${B.rule}`,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: B.mono, fontSize: 10, color: B.mute,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <span>Index / Willkommen</span>
          <span>Berlin · {window.PROJEKTE.length} Projekte · Stand 05.2026</span>
        </div>

        {/* Headline */}
        <section style={{ padding: '64px 48px 48px' }}>
          <div style={{
            fontFamily: B.mono, fontSize: 10, color: B.mute,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            §00 — Einleitung
          </div>
          <h1 style={{
            fontSize: 64, fontWeight: 500, lineHeight: 0.98,
            letterSpacing: '-0.035em', margin: '24px 0 0',
            maxWidth: 880,
          }}>
            Städtebau, der<br/>
            <em style={{ fontWeight: 400, fontStyle: 'italic' }}>Kontext liest</em><br/>
            statt ihn zu&nbsp;verschieben.
          </h1>
          <div style={{
            marginTop: 36,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
            maxWidth: 880,
          }}>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: B.ink, margin: 0 }}>
              Wir verfügen über eine umfassende Erfahrung in der praxisorientierten
              Stadtplanung und im kontextuellen Städtebau. Wir arbeiten integrativ,
              komplex, fachübergreifend sowie teamorientiert.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: B.mute, margin: 0 }}>
              Unser Aufgabenspektrum umfasst strategische Stadtplanung, Bauleitplanung,
              Quartiersentwicklung, Machbarkeitsstudien, Wettbewerbe und Partizipation.
            </p>
          </div>
        </section>

        {/* Hero plate */}
        <div style={{ padding: '0 48px' }}>
          <Placeholder ratio="21/8" tone="photo" label="SLF · Berlin 2024" />
        </div>

        {/* Office facts table */}
        <section style={{
          padding: '64px 48px',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          borderBottom: `1px solid ${B.rule}`,
        }}>
          {[
            ['Gegründet', '1992'],
            ['Sitz', 'Berlin-Neukölln'],
            ['Rechtsform', 'PartG mbB'],
            ['Partner:innen', '3'],
          ].map(([k, v], i) => (
            <div key={k} style={{
              padding: '0 24px',
              borderLeft: i === 0 ? 'none' : `1px solid ${B.ruleSoft}`,
            }}>
              <div style={{
                fontFamily: B.mono, fontSize: 10, color: B.mute,
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
              }}>{k}</div>
              <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em' }}>
                {v}
              </div>
            </div>
          ))}
        </section>

        {/* Featured projects */}
        <section style={{ padding: '64px 48px 32px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            paddingBottom: 18, borderBottom: `1px solid ${B.ink}`,
          }}>
            <div>
              <div style={{
                fontFamily: B.mono, fontSize: 10, color: B.mute,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>§01 — Auswahl</div>
              <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 8 }}>
                Aktuelle Projekte
              </div>
            </div>
            <div style={{ fontSize: 13, color: B.mute }}>
              <span style={{ borderBottom: `1px solid ${B.ink}`, color: B.ink, paddingBottom: 1 }}>
                Index ansehen ↗
              </span>
            </div>
          </div>

          {/* 2x2 grid */}
          <div style={{
            marginTop: 32,
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '48px 32px',
          }}>
            {featured.map((p, i) => (
              <div key={p.id}>
                <div style={{
                  fontFamily: B.mono, fontSize: 10, color: B.mute,
                  letterSpacing: '0.1em', marginBottom: 10,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span>{String(i + 1).padStart(2, '0')} / {p.kategorie.toUpperCase()}</span>
                  <span>{p.jahr}</span>
                </div>
                <Placeholder ratio="3/2" tone={i % 2 === 0 ? 'photo' : 'plan'} label={p.id} />
                <h3 style={{
                  fontSize: 22, fontWeight: 500, lineHeight: 1.2,
                  letterSpacing: '-0.02em', margin: '16px 0 0',
                }}>
                  {p.titel}
                </h3>
                {p.untertitel && (
                  <div style={{ fontSize: 14, color: B.mute, marginTop: 2, fontStyle: 'italic' }}>
                    {p.untertitel}
                  </div>
                )}
                <div style={{
                  marginTop: 14, paddingTop: 12,
                  borderTop: `1px solid ${B.ruleSoft}`,
                  fontFamily: B.mono, fontSize: 11, color: B.mute,
                  display: 'flex', gap: 18,
                }}>
                  <span>{p.ort}</span>
                  <span>{p.flaeche}</span>
                  <span style={{ marginLeft: 'auto', color: B.ink }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Long quote / partner note */}
        <section style={{
          padding: '64px 48px',
          borderTop: `1px solid ${B.rule}`,
          display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32,
        }}>
          <div style={{
            fontFamily: B.mono, fontSize: 10, color: B.mute,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            §02 — Büro<br/>
            <span style={{ color: B.ink, fontSize: 11, letterSpacing: 0, marginTop: 8, display: 'block' }}>
              Übergabe 2024
            </span>
          </div>
          <p style={{ fontSize: 22, lineHeight: 1.45, margin: 0, maxWidth: 760, letterSpacing: '-0.01em' }}>
            Nach mehr als 30 Jahren hat <em>J. Miller&nbsp;Stevens</em> das Büro an
            Georg Börsch-Supan, Samir Hamzeh und Barbara Horst übergeben. Wir freuen
            uns auf spannende Projekte und weiterhin gute Zusammenarbeit in alten
            und neuen Konstellationen.
          </p>
        </section>
      </main>
    </div>
  );
}

function BProjekte() {
  return (
    <div style={{ ...bBase, display: 'flex', minHeight: '100%' }} data-screen-label="B · Projekte">
      <BRail active="Projekte" />

      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Top meta */}
        <div style={{
          padding: '20px 48px',
          borderBottom: `1px solid ${B.rule}`,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: B.mono, fontSize: 10, color: B.mute,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <span>Index / Projekte</span>
          <span>{window.PROJEKTE.length} Einträge · Stand 05.2026</span>
        </div>

        {/* Title row */}
        <section style={{ padding: '56px 48px 24px' }}>
          <div style={{
            fontFamily: B.mono, fontSize: 10, color: B.mute,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Projektverzeichnis
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginTop: 16, gap: 32,
          }}>
            <h1 style={{
              fontSize: 56, fontWeight: 500, lineHeight: 0.98,
              letterSpacing: '-0.03em', margin: 0,
            }}>
              Projekte&nbsp;<span style={{ color: B.mute, fontWeight: 400 }}>1992&nbsp;–&nbsp;2026</span>
            </h1>
            <div style={{ fontFamily: B.mono, fontSize: 11, color: B.mute, textAlign: 'right' }}>
              View:&nbsp;&nbsp;
              <span style={{ color: B.ink, borderBottom: `1px solid ${B.ink}` }}>List</span>
              &nbsp;&nbsp;Grid&nbsp;&nbsp;Karte
            </div>
          </div>
        </section>

        {/* Filter row */}
        <section style={{
          padding: '20px 48px',
          borderTop: `1px solid ${B.rule}`,
          borderBottom: `1px solid ${B.rule}`,
          display: 'flex', alignItems: 'center', gap: 24,
          fontFamily: B.mono, fontSize: 11, color: B.mute,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <span>Filter:</span>
          {['Alle', 'Wettbewerb', 'Bauleitplanung', 'Rahmenplan', 'Quartier', 'Studie'].map((f, i) => (
            <span key={f} style={{
              color: i === 0 ? B.ink : B.mute,
              borderBottom: i === 0 ? `1px solid ${B.ink}` : 'none',
              paddingBottom: 2,
            }}>{f}</span>
          ))}
          <span style={{ marginLeft: 'auto' }}>Sort: Jahr ↓</span>
        </section>

        {/* Index table */}
        <section style={{ padding: '0 48px' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '52px 1.6fr 1fr 0.8fr 0.6fr 32px',
            gap: 16,
            padding: '14px 0',
            borderBottom: `1px solid ${B.rule}`,
            fontFamily: B.mono, fontSize: 10, color: B.mute,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <span>№</span>
            <span>Projekt</span>
            <span>Kategorie</span>
            <span>Ort</span>
            <span style={{ textAlign: 'right' }}>Jahr</span>
            <span/>
          </div>
          {window.PROJEKTE.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid',
              gridTemplateColumns: '52px 1.6fr 1fr 0.8fr 0.6fr 32px',
              gap: 16,
              padding: '18px 0',
              borderBottom: `1px solid ${B.ruleSoft}`,
              alignItems: 'baseline',
            }}>
              <span style={{ fontFamily: B.mono, fontSize: 11, color: B.mute }}>
                {String(i + 1).padStart(3, '0')}
              </span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
                  {p.titel}
                </div>
                {p.untertitel && (
                  <div style={{ fontSize: 13, color: B.mute, marginTop: 2, fontStyle: 'italic' }}>
                    {p.untertitel}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 13, color: B.ink }}>{p.kategorie}</span>
              <span style={{ fontSize: 13, color: B.mute }}>{p.ort}</span>
              <span style={{ fontFamily: B.mono, fontSize: 12, color: B.ink, textAlign: 'right' }}>{p.jahr}</span>
              <span style={{ textAlign: 'right', fontSize: 16, color: B.ink }}>→</span>
            </div>
          ))}
        </section>

        {/* Visual strip — featured spread */}
        <section style={{
          padding: '72px 48px 64px',
          borderTop: `1px solid ${B.rule}`,
          marginTop: 40,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            paddingBottom: 18,
          }}>
            <div style={{
              fontFamily: B.mono, fontSize: 10, color: B.mute,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>§ — Hervorgehoben</div>
            <div style={{ fontFamily: B.mono, fontSize: 11, color: B.mute }}>
              3 Auszeichnungen 2024
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16,
          }}>
            <Placeholder ratio="4/3" tone="photo" label="Bahnbogen Leipzig" sublabel="1. Preis" />
            <Placeholder ratio="4/3" tone="plan" label="Hafenareal Kassel" sublabel="Anerkennung" />
            <Placeholder ratio="4/3" tone="photo" label="Blankenburger Süden" />
          </div>
        </section>
      </main>
    </div>
  );
}

window.BHome = BHome;
window.BProjekte = BProjekte;
