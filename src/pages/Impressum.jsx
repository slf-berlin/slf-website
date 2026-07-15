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
            Registernummer: PR 1850B
          </div>

          <div style={sectionHeadStyle}>Umsatzsteuer-Identifikationsnummer</div>
          <div style={textStyle}>
            USt-IdNr. gemäß § 27a Umsatzsteuergesetz:<br />
            DE453383605
          </div>

          <div style={sectionHeadStyle}>Berufsrechtliche Angaben</div>
          <div style={textStyle}>
            Die berufsrechtlichen Regelungen können über die Webseite Architektenkammer Berlin{' '}
            <a href="https://www.ak-berlin.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.ak-berlin.de</a>
            {' '}/ Kapitel: Recht eingesehen und abgerufen werden. Die gesetzlichen Berufsbezeichnungen „Stadtplaner" und „Architektin" wurden in Deutschland erworben von Stadt Land Fluss durch Eintragung in die Architektenliste der Berliner Architektenkammer.
            <br /><br />
            Partnerschaftsgesellschaft eingetragen in das Gesellschaftsverzeichnis der Berufsgesellschaften bei der Architektenkammer Berlin mit der Register-Nr. PG375
            <br /><br />
            Georg Börsch-Supan, Stadtplaner, Mitgliedsnr. S0419<br />
            Samir Hamzeh, Stadtplaner, Mitgliedsnr. S0625<br />
            Barbara Horst, Architektin, Mitgliedsnr. 09918
            <br /><br />
            Architektenkammer Berlin<br />
            Alte Jakobstraße 149<br />
            D-10969 Berlin
            <br /><br />
            Telefon: +49(0)30. 293307-0<br />
            Mail: <a href="mailto:kammer@ak-berlin.de" style={linkStyle}>kammer@ak-berlin.de</a><br />
            Web: <a href="https://www.ak-berlin.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.ak-berlin.de</a>
          </div>

          <div style={sectionHeadStyle}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</div>
          <div style={textStyle}>
            Georg Börsch-Supan, Samir Hamzeh, Barbara Horst<br />
            Mahlower Straße 24<br />
            12049 Berlin
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
