import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Projekte from './pages/Projekte'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 1400, margin: '0 auto', background: '#fff' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projekte" element={<Projekte />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
