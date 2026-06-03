import { Link } from 'react-router-dom'
import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useWindowWidth } from '../hooks/useWindowWidth'

const LEISTUNGEN = [
  {
    key: 'stadtentwicklung',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="18" width="5" height="10"/>
        <rect x="9" y="11" width="6" height="17"/>
        <rect x="17" y="15" width="5" height="13"/>
        <rect x="24" y="7" width="6" height="21"/>
        <line x1="1" y1="28" x2="31" y2="28"/>
      </svg>
    ),
    titel: 'Strategische Stadtentwicklungsplanung',
    text: 'Analysen und Planungen zu stadtentwicklungsrelevanten Themen – von der Gesamtstadt bis zum Quartier. Ermittlung von raumbezogenen Potenzialen wie Wohnungsbau-, sozialinfrastrukturellen und gewerblichen Entwicklungspotenzialen.',
  },
  {
    key: 'raumanalyse',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13" cy="13" r="8"/>
        <line x1="19" y1="19" x2="28" y2="28"/>
        <line x1="10" y1="13" x2="16" y2="13"/>
        <line x1="13" y1="10" x2="13" y2="16"/>
      </svg>
    ),
    titel: 'Raumanalyse & Konzeptentwicklung',
    text: 'Vertiefende Raumanalysen als Grundlage für ideenreiche städtebauliche und freiraumplanerische Konzepte. Entwicklungsplanungen, städtebauliche Gutachten und Machbarkeitsstudien auf unterschiedlichen Maßstabsebenen.',
  },
  {
    key: 'rahmenplanung',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="26" height="26"/>
        <line x1="12" y1="3" x2="12" y2="29"/>
        <line x1="20" y1="3" x2="20" y2="29"/>
        <line x1="3" y1="12" x2="29" y2="12"/>
        <line x1="3" y1="20" x2="29" y2="20"/>
      </svg>
    ),
    titel: 'Rahmenplanung',
    text: 'Integrierte Rahmenplanungen mit städtebaulichen Vertiefungsstudien und umsetzungsorientierten Maßnahmenkonzepten.',
  },
  {
    key: 'bauleitplanung',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="24" height="26"/>
        <line x1="9" y1="9" x2="23" y2="9"/>
        <line x1="9" y1="14" x2="23" y2="14"/>
        <line x1="9" y1="19" x2="17" y2="19"/>
        <polyline points="17,22 20,25 27,18"/>
      </svg>
    ),
    titel: 'Bauleitplanung',
    text: 'Umfassende Planverfahren für Flächennutzungs- und Bebauungspläne sowie Ergänzungssatzungen.',
  },
  {
    key: 'quartier',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="10" height="10"/>
        <rect x="19" y="3" width="10" height="10"/>
        <rect x="3" y="19" width="10" height="10"/>
        <rect x="19" y="19" width="10" height="10"/>
      </svg>
    ),
    titel: 'Quartiersentwicklung',
    text: 'Begleitung und Steuerung von Quartiersentwicklungen. Vorbereitende Untersuchungen nach § 141 BauGB. Integrierte Stadt- und Stadtteilentwicklungskonzepte.',
  },
  {
    key: 'qualitaet',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="12" r="8"/>
        <polyline points="11,19 8,29 16,25 24,29 21,19"/>
        <polyline points="12,12 15,15 20,9"/>
      </svg>
    ),
    titel: 'Qualitätssichernde Verfahren',
    text: 'Organisation und Steuerung von Wettbewerbs- und Gutachterverfahren. Mitwirkung als Berater, Fachexperte, Obergutachter und Fachpreisrichter.',
  },
  {
    key: 'partizipation',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="8" r="4"/>
        <path d="M8 28c0-8 16-8 16 0"/>
        <circle cx="6" cy="12" r="3"/>
        <path d="M1 26c0-6 10-6 10 0"/>
        <circle cx="26" cy="12" r="3"/>
        <path d="M21 26c0-6 10-6 10 0"/>
      </svg>
    ),
    titel: 'Partizipationsverfahren',
    text: 'Strukturierung und Steuerung von formellen sowie informellen Partizipationsprozessen. Anwendung unterschiedlicher Beteiligungsformate.',
  },
  {
    key: 'koordinierung',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="5" r="3"/>
        <circle cx="5" cy="25" r="3"/>
        <circle cx="27" cy="25" r="3"/>
        <line x1="14" y1="8" x2="7" y2="22"/>
        <line x1="18" y1="8" x2="25" y2="22"/>
        <line x1="8" y1="25" x2="24" y2="25"/>
      </svg>
    ),
    titel: 'Koordinierung Fachgutachten',
    text: 'Einbeziehung von Fachplanungen (Umwelt, Naturschutz, Immissionsschutz, Verkehr). Kooperation mit Kolleg*innen aus Landschaftsplanung, Architektur und Verkehrsplanung.',
  },
]


export default function Buero() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 112
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 8'

  return (
    <div style={base}>
      <Nav />

      {/* Hero */}
      <div style={{ paddingLeft: isMobile ? 12 : 36, paddingRight: isMobile ? 12 : 36 }}>
        <img
          src="https://www.slf-berlin.de/wordpress/wp-content/uploads/2025/01/img-0826-erweitert-1536x990.jpg"
          alt="Stadt Land Fluss — Büro"
          style={{
            display: 'block',
            width: '100%',
            height: isMobile ? 220 : 500,
            objectFit: 'cover',
            objectPosition: 'center 30%',
          }}
        />
      </div>

      {/* 01 / Büro — Über uns */}
      <div style={{
        padding: `${vPad}px ${hPad}px ${isMobile ? 40 : 56}px`,
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: 24,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 13,
          color: A.mute,
        }}>
          01 /<br />Büro
        </div>
        <div style={{ gridColumn: contentCol }}>
          <p style={{
            fontSize: isMobile ? 17 : 18,
            lineHeight: 1.8,
            color: A.mute,
            margin: '0 0 20px',
            maxWidth: 620,
          }}>
            STADT LAND FLUSS wurde 1993 in Berlin gegründet und verfügt über
            umfassende Erfahrung in der praxisorientierten Stadtplanung und im
            kontextuellen Städtebau.
          </p>
          <p style={{
            fontSize: isMobile ? 17 : 18,
            lineHeight: 1.8,
            color: A.mute,
            margin: 0,
            maxWidth: 620,
          }}>
            Wir arbeiten integrativ, komplex, fachübergreifend sowie
            teamorientiert und engagieren uns für die Sicherung einer
            menschenwürdigen Umwelt.
          </p>
        </div>
      </div>

      {/* 3-image gallery */}
      <div style={{
        padding: `0 ${hPad}px ${vPad}px`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 12 : 16,
        }}>
          {[
            {
              src: 'https://www.slf-berlin.de/wordpress/wp-content/uploads/2024/07/img-7857-scaled-e1720599088182-860x625.jpg',
              caption: 'Immer in der Stadt …',
            },
            {
              src: 'https://www.slf-berlin.de/wordpress/wp-content/uploads/2024/07/8c968187-cea8-4570-8e05-703808cb86d9-860x645.jpg',
              caption: '… auf dem Land …',
            },
            {
              src: 'https://www.slf-berlin.de/wordpress/wp-content/uploads/2024/07/img-7862-860x645.jpg',
              caption: '… und am Wasser.',
            },
          ].map(({ src, caption }) => (
            <figure key={src} style={{ margin: 0 }}>
              <img
                src={src}
                alt={caption}
                style={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                }}
              />
              <figcaption style={{
                fontSize: 14,
                color: A.mute,
                marginTop: 8,
                fontStyle: 'italic',
              }}>
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* 02 / Leistungen */}
      <div id="leistungen" style={{
        padding: `${vPad}px ${hPad}px`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
          marginBottom: isMobile ? 36 : 52,
        }}>
          <div style={{
            gridColumn: labelCol,
            fontSize: 12,
            color: A.mute,
          }}>
            02 /<br />Leistungen
          </div>
          <div style={{ gridColumn: contentCol }}>
            <h2 style={{
              fontWeight: 600,
              fontSize: isMobile ? 20 : 30,
              letterSpacing: '-0.015em',
              margin: 0,
            }}>
              Unser Leistungsspektrum
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
        }}>
          <div style={{
            gridColumn: isMobile ? 'auto' : '3 / span 9',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 0 : 40,
            rowGap: 0,
          }}>
            {LEISTUNGEN.map((l) => (
              <div key={l.key} style={{
                padding: `${isMobile ? 20 : 40}px 0`,
              }}>
                <div style={{
                  color: A.mute,
                  marginBottom: 12,
                  lineHeight: 0,
                }}>
                  {l.icon}
                </div>
                <div style={{
                  fontSize: isMobile ? 17 : 20,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                  marginBottom: 10,
                  color: A.ink,
                }}>
                  {l.titel}
                </div>
                <div style={{
                  fontSize: isMobile ? 15 : 16,
                  color: A.mute,
                  lineHeight: 1.65,
                }}>
                  {l.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 03 / Team */}
      <div style={{
        padding: `${vPad}px ${hPad}px`,
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: 24,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 13,
          color: A.mute,
        }}>
          03 /<br />Team
        </div>
        <div style={{ gridColumn: contentCol }}>
          <p style={{
            fontSize: isMobile ? 17 : 18,
            lineHeight: 1.8,
            color: A.mute,
            margin: '0 0 28px',
            maxWidth: 540,
          }}>
            Hinter STADT LAND FLUSS stehen drei Partner und ein engagiertes Team aus Stadtplaner*innen mit jahrzehntelanger Berliner Erfahrung.
          </p>
          <Link
            to="/buero/team"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 14,
              color: A.ink,
              borderBottom: `1px solid ${A.ink}`,
              paddingBottom: 3,
              fontWeight: 600,
            }}
          >
            Unser Team kennenlernen
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="7" x2="12" y2="7"/>
              <polyline points="8,3 12,7 8,11"/>
            </svg>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
