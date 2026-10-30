import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { MuseumProvider } from './context/MuseumContext'
import { ScrollToTop } from './components/ScrollToTop'
import { FloatingMapButton } from './components/FloatingMapButton'
import { MapOverlay } from './components/MapOverlay'
import { EntrancePage } from './pages/EntrancePage'
import { MainHallPage } from './pages/MainHallPage'
import { SkillsPage } from './pages/SkillsPage'
import { RoomPage } from './pages/RoomPage'
import { CorridorPage } from './pages/CorridorPage'
import { rooms } from './data/museum'
import { useMediaQuery } from './hooks/useDevice'

function MobileExperienceNotice() {
  const isMobile = useMediaQuery('(max-width: 767px), (pointer: coarse)')
  const [open, setOpen] = useState(() => isMobile && !sessionStorage.getItem('museum-mobile-notice-seen'))
  if (!open) return null
  const continueOnMobile = () => {
    sessionStorage.setItem('museum-mobile-notice-seen', 'true')
    setOpen(false)
  }
  return <div className="mobile-experience-notice" role="dialog" aria-modal="true" aria-labelledby="mobile-notice-title">
    <div className="mobile-experience-card">
      <p className="eyebrow">A note before entering</p>
      <h1 id="mobile-notice-title">Designed for a larger screen</h1>
      <p>This museum is built for desktop and large screens, where the rotunda, paintings and scroll navigation can be experienced best. You can still continue on mobile with a simplified touch-friendly experience.</p>
      <button type="button" className="btn-gold" onClick={continueOnMobile}>OK · Continue on mobile</button>
    </div>
  </div>
}

function NotFound() {
  useEffect(() => {
    document.title = 'Lost in the Museum — The Museum of Kishore'
  }, [])

  return (
    <main className="room-frame room-enter">
      <div className="frame-line" aria-hidden="true" />
      <div className="container-museum flex min-h-svh flex-col items-center justify-center text-center">
        <p className="eyebrow">404 · Wrong corridor</p>
        <h1 className="mt-4 text-5xl text-gold-gradient sm:text-7xl">This door leads nowhere</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          A guard will walk you back to the Main Hall. It happens to the best visitors.
        </p>
        <Link to="/hall" className="btn-gold mt-8">
          Back to the Main Hall
        </Link>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MuseumProvider>
        <ScrollToTop />
        <MobileExperienceNotice />
        <Routes>
          <Route path="/" element={<EntrancePage />} />
          <Route path="/hall" element={<MainHallPage />} />
          {rooms.map((room) => (
            <Route key={room.id} path={room.path} element={room.id === 'skills' ? <SkillsPage /> : <RoomPage room={room} />} />
          ))}
          {rooms.map((room) => (
            <Route key={`corridor-${room.id}`} path={`/corridor/${room.id}`} element={<CorridorPage />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingMapButton />
        <MapOverlay />
      </MuseumProvider>
    </BrowserRouter>
  )
}
