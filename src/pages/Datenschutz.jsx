import { tokens as A, base } from '../tokens'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useWindowWidth } from '../hooks/useWindowWidth'

export default function Datenschutz() {
  const width = useWindowWidth()
  const isMobile = width < 768

  const hPad = isMobile ? 20 : 56
  const vPad = isMobile ? 56 : 88
  const gridCols = isMobile ? '1fr' : 'repeat(12, 1fr)'
  const labelCol = isMobile ? 'auto' : '1 / span 1'
  const contentCol = isMobile ? 'auto' : '3 / span 7'

  const textStyle = {
    fontSize: isMobile ? 15 : 16,
    lineHeight: 1.85,
    color: A.ink,
    margin: 0,
  }
  const sectionHeadStyle = {
    fontSize: 13,
    color: A.ink,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 36,
  }
  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    borderBottom: `1px solid ${A.rule}`,
    wordBreak: 'break-all',
  }
  const listStyle = {
    ...textStyle,
    paddingLeft: 16,
    margin: '10px 0 0',
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
          Datenschutz
        </div>

        <div style={{ gridColumn: contentCol }}>

          <div style={textStyle}>
            Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der EU-Datenschutzgrundverordnung (DSGVO), ist:
          </div>
          <div style={{ ...textStyle, marginTop: 16 }}>
            STADT LAND FLUSS<br />
            Städtebau und Stadtplanung PartG mbB<br />
            Georg Börsch-Supan · Samir Hamzeh · Barbara Horst<br />
            Mahlower Straße 24<br />
            12049 Berlin
          </div>

          <div style={{ height: 1, background: A.rule, margin: '36px 0' }} />

          <div style={sectionHeadStyle}>Ihre Betroffenenrechte</div>
          <div style={textStyle}>
            Unter den angegebenen Kontaktdaten unseres Datenschutzbeauftragten können Sie jederzeit folgende Rechte ausüben:
          </div>
          <ul style={listStyle}>
            <li>Auskunft über Ihre bei uns gespeicherten Daten und deren Verarbeitung</li>
            <li>Berichtigung unrichtiger personenbezogener Daten</li>
            <li>Löschung Ihrer bei uns gespeicherten Daten</li>
            <li>Einschränkung der Datenverarbeitung, sofern wir Ihre Daten aufgrund gesetzlicher Pflichten noch nicht löschen dürfen</li>
            <li>Widerspruch gegen die Verarbeitung Ihrer Daten bei uns</li>
            <li>Datenübertragbarkeit, sofern Sie in die Datenverarbeitung eingewilligt haben oder einen Vertrag mit uns abgeschlossen haben</li>
          </ul>
          <div style={{ ...textStyle, marginTop: 16 }}>
            Sofern Sie uns eine Einwilligung erteilt haben, können Sie diese jederzeit mit Wirkung für die Zukunft widerrufen.
          </div>
          <div style={{ ...textStyle, marginTop: 16 }}>
            Sie können sich jederzeit mit einer Beschwerde an die für Sie zuständige Aufsichtsbehörde wenden. Ihre zuständige Aufsichtsbehörde richtet sich nach dem Bundesland Ihres Wohnsitzes, Ihrer Arbeit oder der mutmaßlichen Verletzung. Eine Liste der Aufsichtsbehörden (für den nichtöffentlichen Bereich) finden Sie unter:{' '}
            <a
              href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              bfdi.bund.de
            </a>.
          </div>

          <div style={sectionHeadStyle}>Zwecke der Datenverarbeitung</div>
          <div style={textStyle}>
            Wir verarbeiten Ihre personenbezogenen Daten nur zu den in dieser Datenschutzerklärung genannten Zwecken. Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den genannten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
          </div>
          <ul style={listStyle}>
            <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben</li>
            <li>die Verarbeitung zur Abwicklung eines Vertrags mit Ihnen erforderlich ist</li>
            <li>die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist</li>
            <li>die Verarbeitung zur Wahrung berechtigter Interessen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben</li>
          </ul>

          <div style={sectionHeadStyle}>Löschung bzw. Sperrung der Daten</div>
          <div style={textStyle}>
            Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Wir speichern Ihre personenbezogenen Daten daher nur so lange, wie dies zur Erreichung der hier genannten Zwecke erforderlich ist oder wie es die vom Gesetzgeber vorgesehenen Speicherfristen vorsehen. Nach Fortfall des jeweiligen Zweckes bzw. Ablauf dieser Fristen werden die entsprechenden Daten routinemäßig und entsprechend den gesetzlichen Vorschriften gesperrt oder gelöscht.
          </div>

          <div style={sectionHeadStyle}>Änderung unserer Datenschutzbestimmungen</div>
          <div style={textStyle}>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z. B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </div>

          <div style={sectionHeadStyle}>Fragen zum Datenschutz</div>
          <div style={textStyle}>
            Bei Fragen zum Datenschutz wenden Sie sich bitte per E-Mail an{' '}
            <a href="mailto:info@slf-berlin.de" style={linkStyle}>info@slf-berlin.de</a>.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
