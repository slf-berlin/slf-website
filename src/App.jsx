import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Projekte from './pages/Projekte'
import ProjectDetail from './pages/ProjectDetail'
import Buero from './pages/Buero'
import Team from './pages/Team'
import Kontakt from './pages/Kontakt'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1))
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80
          window.scrollTo({ top, behavior: 'smooth' })
          return
        }
      }, 50)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ maxWidth: 1400, margin: '0 auto', background: '#fff' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projekte" element={<Projekte />} />
          <Route path="/projekte/:id" element={<ProjectDetail />} />
          <Route path="/buero" element={<Buero />} />
          <Route path="/buero/ueber-uns" element={<Buero />} />
          <Route path="/buero/leistungen" element={<Buero />} />
          <Route path="/buero/team" element={<Team />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
