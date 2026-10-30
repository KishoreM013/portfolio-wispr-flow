import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { Check, Compass, LockKeyhole, X } from 'lucide-react'
import { rooms, type Room } from '../data/museum'
import { useMuseum } from '../context/museum-context'
import { MuseumIcon } from './MuseumIcon'

const floorOrder = [
  { label: 'Ground floor · 01', ids: ['skills', 'volunteering', 'contributions', 'writing', 'hobbies'] },
  { label: 'Upper floor · 02', ids: ['projects', 'accounts', 'achievements', 'vip', 'management'] },
  { label: 'Basement · B1', ids: ['basement'] },
] as const

function RoomRow({ room, current }: { room: Room; current: boolean }) {
  const { visited, closeMap } = useMuseum()
  const seen = visited.has(room.id)

  return (
    <Link
      to={room.path}
      onClick={closeMap}
      className={[
        'group flex min-h-[64px] items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors sm:px-4',
        current
          ? 'border-gold/60 bg-gold/[0.08]'
          : seen
            ? 'border-gold/25 bg-white/[0.025] hover:border-gold/50 hover:bg-gold/[0.06]'
            : 'border-line/70 bg-white/[0.015] hover:border-gold/40 hover:bg-white/[0.04]',
      ].join(' ')}
    >
      <span
        className={[
          'grid h-9 w-9 shrink-0 place-items-center rounded-sm border',
          seen || current
            ? 'border-gold/50 bg-gold/10 text-gold-bright'
            : 'border-line bg-charcoal text-muted',
        ].join(' ')}
      >
        <MuseumIcon name={room.icon} className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-cream">{room.name}</span>
          {room.staffOnly && (
            <LockKeyhole className="h-3 w-3 shrink-0 text-muted" aria-label="Staff only" />
          )}
          {current && (
            <span className="shrink-0 rounded-sm bg-gold px-1.5 py-0.5 font-mono text-[8px] font-semibold tracking-[0.14em] text-ink uppercase">
              Here
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">{room.tagline}</span>
      </span>

      <span className="shrink-0">
        {seen ? (
          <span className="grid h-6 w-6 place-items-center rounded-full border border-gold/50 bg-gold/15 text-gold-bright">
            <Check className="h-3 w-3" aria-label="Visited" />
          </span>
        ) : (
          <span className="font-mono text-[9px] tracking-[0.14em] text-muted/70 uppercase">
            New
          </span>
        )}
      </span>
    </Link>
  )
}

export function MapOverlay() {
  const { mapOpen, closeMap, visitedCount } = useMuseum()
  const location = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!mapOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMap()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [mapOpen, closeMap])

  if (!mapOpen) return null

  const currentRoom = rooms.find((room) => room.path === location.pathname)
  const allSeen = visitedCount === rooms.length
  const progress = Math.round((visitedCount / rooms.length) * 100)

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/85 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeMap()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="museum-map-title"
        className="museum-map-panel plaque room-enter flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none sm:rounded-sm"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line/80 px-5 py-5 sm:px-7">
          <div>
            <p className="eyebrow">Floor plan</p>
            <h2 id="museum-map-title" className="mt-1 text-3xl sm:text-4xl">
              Museum Map
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeMap}
            aria-label="Close map"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-line text-cream-dim transition-colors hover:border-gold/60 hover:text-gold-bright"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="museum-map-body min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
          <div className="mb-5 rounded-sm border border-line/70 bg-black/20 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-cream-dim">
                You have seen{' '}
                <span className="font-semibold text-gold-bright">
                  {visitedCount} of {rooms.length}
                </span>{' '}
                rooms
              </p>
              <span className="font-mono text-[10px] text-muted">{progress}%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {allSeen && (
              <p className="mt-2 text-[11px] text-gold-bright">
                Every room seen. Thank you for visiting.
              </p>
            )}
          </div>

          <Link
            to="/hall"
            onClick={closeMap}
            className="group mb-5 flex min-h-[60px] items-center gap-3 rounded-sm border border-gold/40 bg-gold/[0.06] px-3 py-2.5 transition-colors hover:border-gold/70 hover:bg-gold/[0.1] sm:px-4"
          >
            <span className="grid h-9 w-9 place-items-center rounded-sm border border-gold/50 bg-gold/10 text-gold-bright">
              <Compass className="h-4 w-4" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-cream">Main Hall</span>
              <span className="block text-xs text-muted">The statue, ten galleries and the basement archive</span>
            </span>
            <span className="font-mono text-[9px] tracking-[0.14em] text-gold uppercase">
              Return
            </span>
          </Link>

          <div className="grid gap-5 sm:grid-cols-2">
            {floorOrder.map((group) => {
              const groupRooms = group.ids
                .map((id) => rooms.find((room) => room.id === id))
                .filter((room): room is Room => Boolean(room))
              return (
                <section key={group.label} aria-label={group.label}>
                  <h3 className="mb-2 font-mono text-[9px] font-medium tracking-[0.24em] text-gold/80 uppercase">
                    {group.label}
                  </h3>
                  <div className="space-y-2">
                    {groupRooms.map((room) => (
                      <RoomRow
                        key={room.id}
                        room={room}
                        current={currentRoom?.id === room.id}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <div className="border-t border-line/80 px-5 py-3 sm:px-7">
          <p className="text-center font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
            The Museum of Kishore · Est. 2026
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
