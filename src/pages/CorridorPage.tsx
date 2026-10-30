import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { getRoom } from '../data/museum'
import type { RoomId } from '../data/museum'
import { useLiteMode, usePrefersReducedMotion } from '../hooks/useDevice'
import { CorridorScene } from '../components/three/CorridorScene'
import '../components/entrance.css'

export function CorridorPage() {
  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: RoomId }>()
  const lite = useLiteMode()
  const reducedMotion = usePrefersReducedMotion()
  const room = getRoom(roomId!)
  const containerRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [entering, setEntering] = useState(false)
  const [exiting, setExiting] = useState(false)
  const enteringRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const hasScrolledRef = useRef(false)

  useEffect(() => {
    document.title = `${room.name} Corridor — The Museum of Kishore`
    document.documentElement.style.setProperty('background-color', '#08070d')
  }, [room.name])

  const enterRoom = useCallback(() => {
    if (enteringRef.current) return
    enteringRef.current = true
    setEntering(true)
    timerRef.current = window.setTimeout(() => navigate(room.path), 500)
  }, [navigate, room.path])

  const exitToHall = useCallback(() => {
    if (enteringRef.current) return
    enteringRef.current = true
    setExiting(true)
    timerRef.current = window.setTimeout(() => navigate('/hall'), 500)
  }, [navigate])

  useEffect(() => {
    const container = containerRef.current
    const stage = stageRef.current
    if (!container || !stage) return

    let frame = 0
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

    const update = () => {
      frame = 0
      const rect = container.getBoundingClientRect()
      const distance = container.offsetHeight - window.innerHeight
      const progress = distance > 0 ? clamp01(-rect.top / distance) : 0

      progressRef.current = progress
      stage.style.setProperty('--p', progress.toFixed(4))
      stage.classList.toggle('is-past-plaque', progress > 0.15)
      stage.classList.toggle('is-entering', entering)
      stage.classList.toggle('is-exiting', exiting)

      // Track if user has scrolled past initial position
      if (progress > 0.1) hasScrolledRef.current = true

      // Enter room at ~95% scroll
      if (progress > 0.95 && !enteringRef.current) enterRoom()
      // Exit to hall at ~5% scroll (scrolling up) - only after user has scrolled
      if (progress < 0.05 && hasScrolledRef.current && !enteringRef.current && !entering) exitToHall()
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
    }
  }, [enterRoom, exitToHall, entering, exiting])

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current) }, [])

  if (reducedMotion) {
    return (
      <main className="entrance-static">
        <div className="frame-line" aria-hidden="true" />
        <div className="entrance-stage fade-in">
          <div className="entrance-canvas" aria-hidden="true">
            <CorridorScene progressRef={{ current: 1 }} lite={lite} interactive={false} />
          </div>
          <div className="entrance-vignette" aria-hidden="true" />
          <div className="container-museum entrance-topbar">
            <span className="entrance-wordmark">
              <span className="entrance-wordmark-mark" aria-hidden="true">K</span>
              The Museum of Kishore
            </span>
          </div>
          <div className="entrance-plaque-wrap">
            <div className="entrance-plaque">
              <div className="entrance-plaque-glow" aria-hidden="true" />
              <p className="eyebrow">{room.floor}</p>
              <h1>{room.name}</h1>
              <p className="mt-3 text-cream-dim">{room.tagline}</p>
            </div>
          </div>
          <div className="entrance-static-actions">
            <button type="button" className="btn-gold" onClick={() => navigate(room.path)}>
              Enter {room.name}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button type="button" className="btn-ghost ml-4" onClick={() => navigate('/hall')}>
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to Hall
            </button>
          </div>
          <p className="entrance-roomlabel">Corridor · {room.floor}</p>
        </div>
      </main>
    )
  }

  return (
    <main ref={containerRef} className="entrance-scroll">
      <div className="entrance-sticky">
        <div ref={stageRef} className={`entrance-stage${lite ? ' is-lite' : ''}`}>
          <div className="frame-line" aria-hidden="true" />
          <div className="entrance-canvas" aria-hidden="true">
            <CorridorScene
              lite={lite}
              progressRef={progressRef}
              interactive={true}
            />
          </div>
          <div className="entrance-vignette" aria-hidden="true" />
          <div className={`entrance-whiteout${entering || exiting ? ' is-entering' : ''}`} aria-hidden="true" />
          <div className="container-museum entrance-topbar">
            <span className="entrance-wordmark">
              <span className="entrance-wordmark-mark" aria-hidden="true">K</span>
              The Museum of Kishore
            </span>
          </div>
          <div className="entrance-plaque-wrap">
            <div className="entrance-plaque">
              <div className="entrance-plaque-glow" aria-hidden="true" />
              <p className="eyebrow">{room.floor}</p>
              <h1>{room.name}</h1>
              <p className="mt-3 text-cream-dim">{room.tagline}</p>
            </div>
          </div>
          <div className="entrance-progress" aria-hidden="true">
            <div className="entrance-progress-bar" />
          </div>
          <div className="corridor-hint">
            <span className="corridor-hint-text">Scroll to enter</span>
            <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
          </div>
          <p className="entrance-roomlabel">Corridor · {room.floor} · Scroll to enter</p>
        </div>
      </div>
      {/* Scroll spacer to enable scrolling */}
      <div style={{ height: '300vh' }} aria-hidden="true" />
    </main>
  )
}