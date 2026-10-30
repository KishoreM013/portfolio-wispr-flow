import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, LockKeyhole } from 'lucide-react'
import { rooms } from '../data/museum'
import { useMuseum } from '../context/museum-context'
import { MuseumIcon } from './MuseumIcon'

/**
 * The hanging gallery signs beneath the statue. They are the readable,
 * keyboard-friendly way into the rooms; the map stays available as a shortcut.
 */
export function HallPaths() {
  const { visited, visitedCount } = useMuseum()

  return (
    <section className="hall-paths" aria-labelledby="hall-paths-title">
      <div className="container-museum">
        <header className="hall-paths-head">
          <div>
            <p className="eyebrow">The ten galleries</p>
            <h2 id="hall-paths-title" className="hall-paths-title">
              Choose a room
            </h2>
          </div>
          <div className="hall-paths-aside">
            <p>
              Some rooms are about the work. Some are about the person behind it.
              Take them in any order.
            </p>
            <p className="hall-paths-progress" aria-live="polite">
              {visitedCount} of {rooms.length} rooms visited
            </p>
          </div>
        </header>

        <div className="hall-paths-rail" aria-hidden="true" />

        <div className="hall-paths-grid">
          {rooms.filter(room => room.id !== 'basement').map((room, index) => {
            const seen = visited.has(room.id)

            return (
              <Link
                key={room.id}
                to={room.path}
                className={`hall-path${seen ? ' is-seen' : ''}`}
              >
                <span className="hall-path-chain" aria-hidden="true">
                  <span className="hall-path-ring" />
                </span>

                <span className="hall-path-card">
                  <span className="hall-path-top">
                    <span className="hall-path-icon">
                      <MuseumIcon name={room.icon} className="h-4 w-4" />
                    </span>
                    <span className="hall-path-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </span>

                  <span className="hall-path-name">
                    {room.name}
                    {room.staffOnly && (
                      <LockKeyhole
                        className="h-3 w-3 shrink-0 text-muted"
                        aria-label="Staff only"
                      />
                    )}
                  </span>
                  <span className="hall-path-tagline">{room.tagline}</span>

                  <span className="hall-path-meta">
                    <span className="hall-path-floor">{room.floor}</span>
                    <span className="hall-path-action">
                      {seen ? (
                        <>
                          <Check className="h-3 w-3" aria-hidden="true" />
                          Visited
                        </>
                      ) : (
                        <>
                          Enter
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </>
                      )}
                    </span>
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
