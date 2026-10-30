import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Maximize, Minimize, Compass, Columns3, Footprints, ArrowUp, BookOpen, ZoomIn } from 'lucide-react'
import { hall, site } from '../data/museum'
import { HallPaths } from '../components/HallPaths'
import { HallScene, type CuratorBoardId, type HallView } from '../components/three/HallScene'
import { profile } from '../data/collection'
import { useLiteMode, usePrefersReducedMotion } from '../hooks/useDevice'
import '../components/hall.css'

export function MainHallPage() {
  const lite = useLiteMode()
  const reducedMotion = usePrefersReducedMotion()
  const [view, setView] = useState<HallView>('arrival')
  const [zoom, setZoom] = useState(1)
  const [scrollView, setScrollView] = useState<HallView | null>(null)
  const [navigationKey, setNavigationKey] = useState(0)
  const activeView = scrollView ?? view
  const navigateView = (next: HallView) => { setScrollView(null); setView(next); setNavigationKey(k => k + 1) }
  const [directoryOpen, setDirectoryOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [boardOpen, setBoardOpen] = useState<CuratorBoardId | null>(null)
  const directoryRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const update = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', update)
    const onEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setDirectoryOpen(false) }
    window.addEventListener('keydown', onEscape)
    return () => { document.removeEventListener('fullscreenchange', update); window.removeEventListener('keydown', onEscape) }
  }, [])

  useEffect(() => {
    if (!directoryOpen) return
    const previous = document.activeElement as HTMLElement | null
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !directoryRef.current) return
      const items = Array.from(directoryRef.current.querySelectorAll<HTMLElement>('button, a[href]'))
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', trap)
    return () => { window.removeEventListener('keydown', trap); previous?.focus() }
  }, [directoryOpen])

  useEffect(() => {
    document.title = `The Main Hall — ${site.title}`
  }, [])

  useEffect(() => {
    if (!welcomeOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setWelcomeOpen(false)
        return
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [welcomeOpen])

  return (
    <main className="hall-page palace-experience room-enter">
      <section className="hall-hero" aria-labelledby="hall-title">
        <div className="hall-canvas">
          <HallScene lite={lite} interactive={!reducedMotion} zoom={zoom} view={view} onView={navigateView} navigationKey={navigationKey} onScrollStage={setScrollView} onCuratorBoardClick={setBoardOpen} />
        </div>
        <div className="hall-vignette" aria-hidden="true" />
        <div className="frame-line" aria-hidden="true" />

        <div className="container-museum hall-topbar">
          <Link to="/" className="hall-wordmark">
            <span className="hall-wordmark-mark" aria-hidden="true">
              K
            </span>
            The Museum of Kishore
          </Link>
          <div className="palace-top-actions"><span className="hall-roomlabel">The Grand Rotunda</span><button className="palace-icon-button" aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen() } catch { /* The immersive hall remains usable when fullscreen is unavailable. */ } }}>{fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button></div>
        </div>

        <div className="sr-only">
          <p className="eyebrow">The Museum of Kishore</p>
          <h2 id="hall-title">{hall.title}</h2>
          <p>{hall.intro}</p>
        </div>

        <button
          type="button"
          className="hall-welcome-button"
          onClick={() => setWelcomeOpen(true)}
        >
          About the collection
        </button>

        <div className={`palace-room-caption${activeView === 'arrival' ? '' : ' is-exploring'}`} aria-live="polite"><span>{activeView === 'upper' ? '02 / THE UPPER GALLERY' : activeView === 'statue' ? 'THE FOUNDING COLLECTION' : activeView === 'ground' ? 'THE GROUND GALLERIES' : '01 / THE GRAND ROTUNDA'}</span><h1>{activeView === 'upper' ? 'Above the ordinary.' : activeView === 'statue' ? 'Meet the curator.' : activeView === 'ground' ? 'The collection begins here.' : 'The Museum of Kishore'}</h1></div>
        <label className="palace-zoom-control">
          <ZoomIn size={13} aria-hidden="true" />
          <span>View</span>
          <input aria-label="Zoom museum view" type="range" min="0.85" max="1.8" step="0.05" value={zoom} onChange={event => setZoom(Number(event.target.value))} />
          <output>{Math.round(zoom * 100)}%</output>
        </label>
        <div className="palace-navigation">
          <p className="palace-movement-hint"><span className="desktop-instructions">Scroll to explore · Drag to look · Select a gallery board to enter</span><span className="touch-instructions">Swipe up to walk · Swipe sideways to turn · Tap a board to enter</span></p>
          <nav aria-label="Explore the museum" className="palace-nav-dock">
            {([{ id: 'arrival', label: 'Rotunda', short: 'Hall', icon: Compass }, { id: 'statue', label: 'The statue', short: 'Statue', icon: Columns3 }, { id: 'stairs', label: 'Grand stair', short: 'Stairs', icon: Footprints }, { id: 'upper', label: 'Upper gallery', short: 'Upstairs', icon: ArrowUp }] as const).map(item => <button key={item.id} aria-pressed={activeView === item.id} onClick={() => navigateView(item.id)}><item.icon size={15} /><span className="dock-full-label">{item.label}</span><span className="dock-short-label">{item.short}</span></button>)}
            <button aria-expanded={directoryOpen} aria-controls="palace-directory" onClick={() => setDirectoryOpen(v => !v)}><BookOpen size={15} /><span>Galleries</span></button>
          </nav>
        </div>
      </section>

      {directoryOpen && <div className="palace-directory-backdrop" onClick={() => setDirectoryOpen(false)}><section ref={directoryRef} id="palace-directory" className="palace-directory" role="dialog" aria-modal="true" aria-label="Gallery directory" onClick={e => e.stopPropagation()}><button className="palace-directory-close" autoFocus onClick={() => setDirectoryOpen(false)} aria-label="Close gallery directory"><X size={20} /></button><HallPaths /></section></div>}

      {welcomeOpen && (
        <div
          className="hall-welcome-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          onClick={() => setWelcomeOpen(false)}
        >
          <div className="hall-welcome-card" onClick={(event) => event.stopPropagation()}>
            <button
              ref={closeRef}
              type="button"
              className="hall-welcome-close"
              onClick={() => setWelcomeOpen(false)}
              aria-label="Close the welcome card"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="eyebrow">A note from the curator</p>
            <h2 id="welcome-title" className="mt-3 text-3xl text-cream sm:text-4xl">
              {hall.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cream-dim">{hall.intro}</p>
            <p className="mt-5 font-mono text-[9px] tracking-[0.2em] text-gold uppercase">
              Select a board beside an arch, or explore with the museum map
            </p>
          </div>
        </div>
      )}
      {boardOpen && (
        <div className="hall-welcome-modal" role="dialog" aria-modal="true" aria-labelledby="curator-board-title" onClick={() => setBoardOpen(null)}>
          <div className="hall-welcome-card curator-board-modal" onClick={event => event.stopPropagation()}>
            <button type="button" className="hall-welcome-close" onClick={() => setBoardOpen(null)} aria-label="Close details"><X className="h-4 w-4" aria-hidden="true" /></button>
            <p className="eyebrow">{boardOpen === 'education' ? 'The foundations' : 'The practice'}</p>
            <h2 id="curator-board-title" className="mt-3 text-3xl text-cream sm:text-4xl">{boardOpen === 'education' ? 'Education' : 'Experience'}</h2>
            {boardOpen === 'education' ? <>
              <p className="mt-4 text-sm leading-relaxed text-cream-dim">{profile.education}</p>
              <section className="dossier-chapter"><h3>Academic focus</h3><ul><li>Generative AI and deep learning</li><li>Operating systems and software engineering</li><li>Database management systems</li></ul></section>
              <strong className="dossier-metric">{profile.cgpa} CGPA</strong>
            </> : <>
              <section className="dossier-chapter"><h3>Microsoft · May–July 2026</h3><p>Software Engineer Intern focused on AI-powered anomaly detection, service monitoring and incident automation.</p><ul><li>Reduced manual incident handling by 50%, saving approximately 15 hours per week.</li><li>Improved monitoring and mean time to detect.</li><li>Decreased false alarms by 25–30%.</li></ul></section>
              <section className="dossier-chapter"><h3>Research · November–December 2024</h3><p>Research Intern at Chennai Institute of Technology, studying voice-controlled systems and chess AI decision-making.</p><ul><li>Raised voice-command response accuracy by 80%.</li><li>Surveyed more than ten chess engines and five decision-making algorithms.</li><li>Studied AlphaZero’s deep-learning approach to chess.</li></ul></section>
            </>}
            <a className="gallery-resume-link" href="/resume.pdf" download="Kishore_M_Resume.pdf">Read the complete résumé</a>
          </div>
        </div>
      )}
    </main>
  )
}
