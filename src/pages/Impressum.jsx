import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Impressum() {
  usePageMeta('Impressum', 'Impressum der Stadt Land Fluss PartG mbB, Berlin.')
  const width = useWindowWidth()
  const isMobile = width < 768

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 88
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 6'

  const sectionHeadStyle = {
    fontSize: 13,
    color: A.ink,
    fontWeight: 600,
    marginBottom: 8,
    marginTop: 32,
  }
  const textStyle = {
    fontSize: isMobile ? 15 : 16,
    lineHeight: 1.85,
    color: A.ink,
    margin: 0,
  }
  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    borderBottom: `1px solid ${A.rule}`,
  }

  return (
    <div style={base}>
      <Nav />

      <div style={{
        padding: `${vPad}px ${hPad}px ${isMobile ? 64 : 96}px`,
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: 24,
      }}>
        <div style={{
          gridColumn: labelCol,
          fontSize: 13,
          color: A.mute,
          paddingTop: 4,
        }}>
          Impressum
        </div>

        <div style={{ gridColumn: contentCol }}>

          <div style={textStyle}>
            Stadt Land Fluss<br />
            Städtebau und Stadtplanung PartG mbB<br />
            Georg Börsch-Supan · Samir Hamzeh · Barbara Horst
          </div>

          <div style={{ ...textStyle, marginTop: 20 }}>
            Mahlower Straße 24<br />
            12049 Berlin<br />
            Fon: <a href="tel:+493061280848" style={linkStyle}>030 612 808 48</a><br />
            E-Mail: <a href="mailto:info@slf-berlin.de" style={linkStyle}>info@slf-berlin.de</a>
          </div>

          <div style={{ ...textStyle, marginTop: 20 }}>
            Stadt Land Fluss Städtebau und Stadtplanung wird durch Georg Börsch-Supan, Samir Hamzeh, Barbara Horst vertreten.
          </div>

          <div style={sectionHeadStyle}>Registereintrag</div>
          <div style={textStyle}>
            Partnerschaftsregister<br />
            Registergericht: Amtsgericht Charlottenburg (Berlin)<br />
            Registernummer: PR [Nummer bitte ergänzen]
          </div>

          <div style={sectionHeadStyle}>Umsatzsteuer-Identifikationsnummer</div>
          <div style={textStyle}>
            USt-IdNr. gemäß § 27a Umsatzsteuergesetz:<br />
            [DE… bitte ergänzen, sofern vorhanden]
          </div>

          <div style={sectionHeadStyle}>Berufsrechtliche Angaben</div>
          <div style={textStyle}>
            Gesetzliche Berufsbezeichnung: [z. B. Stadtplaner / Architekt – bitte ergänzen]<br />
            Verliehen in: Deutschland<br />
            Zuständige Kammer: [z. B. Architektenkammer Berlin – bitte ergänzen]<br />
            Es gelten die berufsrechtlichen Regelungen (u. a. Baukammergesetz Berlin, Berufsordnung),
            einsehbar bei der zuständigen Kammer.
          </div>

          <div style={sectionHeadStyle}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</div>
          <div style={textStyle}>
            [Name der verantwortlichen Person – bitte ergänzen]<br />
            Mahlower Straße 24<br />
            12049 Berlin
          </div>

          <div style={{ height: 1, background: A.rule, margin: '36px 0' }} />

          <div style={sectionHeadStyle}>Gestaltung</div>
          <div style={textStyle}>
            <a href="https://www.annaweis.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Anna Weis
            </a>
          </div>

          <div style={sectionHeadStyle}>Umsetzung</div>
          <div style={textStyle}>
            <a href="https://ron.kanzownet.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Ron Warmbier
            </a>
          </div>

          <div style={{ height: 1, background: A.rule, margin: '36px 0' }} />

          <div style={sectionHeadStyle}>Haftungshinweis</div>
          <div style={textStyle}>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
