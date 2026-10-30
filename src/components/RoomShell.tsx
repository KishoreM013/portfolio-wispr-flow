import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useMuseum } from '../context/museum-context'
import type { Room } from '../data/museum'
import { MuseumFooter } from './MuseumFooter'
import { TourGuide } from './TourGuide'

/**
 * Every room shares this frame: gallery border, title plaque, a way back,
 * the guide, and the footer. Room content is passed in as children.
 */
export function RoomShell({ room, children }: { room: Room; children: ReactNode }) {
  const { markVisited } = useMuseum()

  useEffect(() => {
    markVisited(room.id)
    document.title = `${room.name} — The Museum of Kishore`
  }, [markVisited, room.id, room.name])

  return (
    <main className="room-frame room-enter">
      <div className="frame-line" aria-hidden="true" />

      <div className="container-museum pt-5 sm:pt-7">
        <div className="flex items-center justify-between gap-4">
          <Link to="/hall" className="btn-quiet">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Hall
          </Link>
          <span className="hidden font-mono text-[9px] tracking-[0.22em] text-muted uppercase sm:block">
            {room.floor}
          </span>
        </div>

        <header className="mx-auto mt-10 max-w-3xl sm:mt-14">
          <div className="plaque px-6 py-7 text-center sm:px-10 sm:py-9">
            <p className="eyebrow">{room.floor}</p>
            <h1 className="mt-2 text-5xl leading-[0.95] text-gold-gradient sm:text-6xl lg:text-7xl">
              {room.name}
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">{room.tagline}</p>
            <div className="gold-rule mx-auto mt-5 max-w-xs" aria-hidden="true" />
          </div>
        </header>

        <div className="mt-10 sm:mt-14">{children}</div>

        <div className="mt-16 flex justify-start sm:mt-20">
          <TourGuide line={room.guideLine} />
        </div>
      </div>

      <MuseumFooter />
    </main>
  )
}
