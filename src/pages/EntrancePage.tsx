import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { entrance, site } from '../data/museum'
import { useLiteMode, usePrefersReducedMotion } from '../hooks/useDevice'
import { MuseumScene } from '../components/three/MuseumScene'
import '../components/entrance.css'

function Topbar({ onSkip, showSkip = true }: { onSkip: () => void; showSkip?: boolean }) {
  return (
    <div className="entrance-topbar">
      <div className="entrance-wordmark">
        <span className="entrance-wordmark-mark" aria-hidden="true">
          K
        </span>
        <span className="entrance-wordmark-text">The Museum of Kishore</span>
      </div>
      {showSkip && (
        <button type="button" onClick={onSkip} className="entrance-skip">
          {entrance.skip}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function WelcomePlaque({
  showHint = true,
  onEnter,
}: {
  showHint?: boolean
  onEnter?: () => void
}) {
  return (
    <div className="entrance-plaque-wrap">
      <div className="entrance-plaque">
        <div className="entrance-plaque-glow" aria-hidden="true" />
        <p className="eyebrow">The Museum of Kishore · Est. 2026</p>
        <h1>{entrance.plaque}</h1>
        {showHint && (
          <button
            type="button"
            onClick={onEnter}
            className="entrance-hint entrance-hint-button"
            aria-label="Enter the museum"
          >
            <span className="desktop-instructions">{entrance.hint}</span><span className="touch-instructions">Swipe to enter</span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

function StaticEntrance() {
  const navigate = useNavigate()
  const lite = useLiteMode()
  const progressRef = useRef(0)

  return (
    <main className="entrance-static">
      <div className="frame-line" aria-hidden="true" />
      <div className="entrance-stage fade-in">
        <div className="entrance-canvas" aria-hidden="true">
          <MuseumScene progressRef={progressRef} lite={lite} interactive={false} />
        </div>
        <div className="entrance-vignette" aria-hidden="true" />
        <Topbar onSkip={() => navigate('/hall')} showSkip={false} />
        <WelcomePlaque showHint={false} />
        <div className="entrance-static-actions">
          <button type="button" className="btn-gold" onClick={() => navigate('/hall')}>
            {entrance.enter}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <p className="entrance-roomlabel">01 · Entrance</p>
      </div>
    </main>
  )
}

function ScrollEntrance() {
  const navigate = useNavigate()
  const lite = useLiteMode()
  const containerRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [entering, setEntering] = useState(false)
  const enteringRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  const skip = useCallback(() => {
    if (enteringRef.current) return
    enteringRef.current = true
    navigate('/hall')
  }, [navigate])

  const enterHall = useCallback(() => {
    if (enteringRef.current) return
    enteringRef.current = true
    setEntering(true)
    timerRef.current = window.setTimeout(() => navigate('/hall'), 650)
  }, [navigate])

  useEffect(() => {
    const container = containerRef.current
    const stage = stageRef.current
    if (!container || !stage) return

    let frame = 0
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
    const smooth = (value: number) => value * value * (3 - 2 * value)

    const update = () => {
      frame = 0
      const rect = container.getBoundingClientRect()
      const distance = container.offsetHeight - window.innerHeight
      const progress = distance > 0 ? clamp01(-rect.top / distance) : 0
      const plaque = 1 - smooth(clamp01((progress - 0.05) / 0.21))

      progressRef.current = progress
      stage.style.setProperty('--p', progress.toFixed(4))
      stage.style.setProperty('--plaque', plaque.toFixed(4))
      stage.classList.toggle('is-past-plaque', progress > 0.3)

      if (progress > 0.985) enterHall()
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [enterHall])

  return (
    <main ref={containerRef} className="entrance-scroll">
      <div className="entrance-sticky">
        <div ref={stageRef} className={`entrance-stage${lite ? ' is-lite' : ''}`}>
          <div className="frame-line" aria-hidden="true" />
          <div className="entrance-canvas" aria-hidden="true">
            <MuseumScene progressRef={progressRef} lite={lite} />
          </div>
          <div className="entrance-vignette" aria-hidden="true" />
          <div
            className={`entrance-whiteout${entering ? ' is-entering' : ''}`}
            aria-hidden="true"
          />
          <Topbar onSkip={skip} />
          <WelcomePlaque onEnter={enterHall} />
          <div className="entrance-progress" aria-hidden="true">
            <div className="entrance-progress-bar" />
          </div>
          <p className="entrance-roomlabel">01 · Entrance · Scroll to enter</p>
        </div>
      </div>
    </main>
  )
}

export function EntrancePage() {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    document.title = `${site.title} — A portfolio in ten rooms`
    document.documentElement.style.setProperty('background-color', '#080706')
  }, [])

  return reducedMotion ? <StaticEntrance /> : <ScrollEntrance />
}
