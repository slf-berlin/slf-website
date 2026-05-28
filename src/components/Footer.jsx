import logo from '../assets/SLF_Logo.svg'
import { tokens as A } from '../tokens'
import { useWindowWidth } from '../hooks/useWindowWidth'

export default function Footer() {
  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width < 1024

  return (
    <div style={{
      borderTop: `1px solid ${A.rule}`,
      padding: isMobile ? '40px 20px 28px' : '48px 56px 36px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
      gap: 32,
      fontSize: 14, lineHeight: 1.55, color: A.ink,
    }}>
      <div>
        <img src={logo} alt="Stadt Land Fluss" style={{ height: 56, width: 'auto', display: 'block', marginBottom: 16 }} />
        <div style={{ color: A.mute, marginTop: 4 }}>Städtebau und Stadtplanung PartG mbB</div>
        <div style={{ color: A.mute, marginTop: 14, maxWidth: 340 }}>
          Georg Börsch-Supan &nbsp;·&nbsp; Samir Hamzeh &nbsp;·&nbsp; Barbara Horst
        </div>
      </div>

      <div>
        <div style={{ color: A.mute, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Kontakt
        </div>
        Mahlower Straße 24<br />
        12049 Berlin<br />
        030 612 808 48<br />
        info@slf-berlin.de
      </div>

      <div>
        <div style={{ color: A.mute, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Navigation
        </div>
        Projekte<br />Büro<br />Kontakt<br />competitionline
      </div>

      <div>
        <div style={{ color: A.mute, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Rechtliches
        </div>
        Impressum<br />Datenschutzerklärung
        <div style={{ marginTop: 22, color: A.mute, fontSize: 12 }}>© 2026</div>
      </div>
    </div>
  )
}
