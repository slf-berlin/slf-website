import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useWindowWidth } from '../hooks/useWindowWidth'

export default function Kontakt() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 88
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 4'

  return (
    <div style={base}>
      <Nav />

      {/* Kontakt info */}
      <div style={{
        padding: `${vPad}px ${hPad}px ${isMobile ? 48 : 72}px`,
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: 24,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 12,
          color: A.accentDeep,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 500,
          paddingTop: 4,
        }}>
          Kontakt
        </div>

        <div style={{ gridColumn: contentCol }}>
          <p style={{
            fontSize: isMobile ? 16 : 17,
            lineHeight: 1.7,
            color: A.mute,
            margin: '0 0 40px',
          }}>
            Unser Büro finden Sie im Neuköllner Schillerkiez,
            in der Mahlower Straße 24,
            Zugang über den Gewerbehof, Aufgang D.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 32 : 48,
          }}>
            {/* Adresse */}
            <div>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: A.accentDeep,
                fontWeight: 500,
                marginBottom: 14,
              }}>
                Adresse
              </div>
              <div style={{ fontSize: isMobile ? 16 : 17, lineHeight: 1.8, color: A.ink }}>
                Stadt Land Fluss<br />
                Städtebau und Stadtplanung PartG mbB<br />
                Mahlower Straße 24<br />
                12049 Berlin
              </div>
            </div>

            {/* Kontakt */}
            <div>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: A.accentDeep,
                fontWeight: 500,
                marginBottom: 14,
              }}>
                Erreichbarkeit
              </div>
              <div style={{ fontSize: isMobile ? 16 : 17, lineHeight: 1.8, color: A.ink }}>
                <a
                  href="tel:+493061280848"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  030 612 808 48
                </a>
                <br />
                <a
                  href="mailto:info@slf-berlin.de"
                  style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${A.rule}` }}
                >
                  info@slf-berlin.de
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Anfahrt-Karte */}
      <div style={{
        padding: `0 ${hPad}px ${vPad}px`,
        borderTop: `1px solid ${A.rule}`,
        paddingTop: isMobile ? 40 : 56,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 24,
        }}>
          <div style={{
            gridColumn: labelCol,
            fontSize: 12,
            color: A.accentDeep,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
            paddingTop: 4,
          }}>
            Anfahrt
          </div>
          <div style={{ gridColumn: isMobile ? 'auto' : '3 / span 10' }}>
            <img
              src="https://www.slf-berlin.de/wordpress/wp-content/uploads/2019/09/anfahrt_karte_slf_berlin_rz_0.svg"
              alt="Anfahrtskarte — Mahlower Straße 24, Berlin Neukölln"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
