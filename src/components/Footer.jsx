import { Link } from 'react-router-dom'
import logo from '../assets/SLF_Logo.svg'
import { tokens as A } from '../tokens'
import { useWindowWidth } from '../hooks/useWindowWidth'

const NAV_LINK_STYLE = `
  .footer-nav-link {
    position: relative;
    display: inline-block;
    color: inherit;
    text-decoration: none;
    margin-bottom: 2px;
  }
  .footer-nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 0;
    height: 1px;
    background: #0e0e10;
    transition: width 220ms ease;
  }
  .footer-nav-link:hover::after {
    width: 100%;
  }
`

export default function Footer() {
  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width < 1024

  return (
    <>
    <style>{NAV_LINK_STYLE}</style>
    <div style={{
      borderTop: `1px solid ${A.rule}`,
      padding: isMobile ? '40px 20px 28px' : '48px 56px 36px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
      gap: 32,
      fontSize: 15, lineHeight: 1.55, color: A.ink,
    }}>
      <div>
        <img src={logo} alt="Stadt Land Fluss" style={{ height: 56, width: 'auto', display: 'block', marginBottom: 16 }} />
        <div style={{ color: A.mute, marginTop: 4 }}>Städtebau und Stadtplanung PartG mbB</div>
        <div style={{ color: A.mute, marginTop: 14, maxWidth: 340 }}>
          Georg Börsch-Supan &nbsp;·&nbsp; Samir Hamzeh &nbsp;·&nbsp; Barbara Horst
        </div>
      </div>

      <div>
        <div style={{ color: A.ink, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          Kontakt
        </div>
        Mahlower Straße 24<br />
        12049 Berlin<br />
        030 612 808 48<br />
        info@slf-berlin.de
      </div>

      <div>
        <div style={{ color: A.ink, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          Navigation
        </div>
        <div style={{ marginBottom: 2 }}><Link to="/projekte" className="footer-nav-link">Projekte</Link></div>
        <div style={{ marginBottom: 2 }}><Link to="/buero" className="footer-nav-link">Büro</Link></div>
        <div style={{ marginBottom: 2 }}><Link to="/kontakt" className="footer-nav-link">Kontakt</Link></div>
        <div><a
          href="https://www.competitionline.com/de/bueros/stadt-land-fluss-staedtebau-und-stadtplanung-partg-mbb-15089/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-nav-link"
        >competitionline</a></div>
      </div>

      <div>
        <div style={{ color: A.ink, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          Rechtliches
        </div>
        <div style={{ marginBottom: 2 }}><Link to="/impressum" className="footer-nav-link">Impressum</Link></div>
        <div><Link to="/datenschutz" className="footer-nav-link">Datenschutzerklärung</Link></div>
        <div style={{ marginTop: 22, color: A.mute, fontSize: 13 }}>© 2026</div>
      </div>
    </div>
    </>
  )
}
