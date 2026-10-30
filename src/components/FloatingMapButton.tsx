import { Map } from 'lucide-react'
import { useMuseum } from '../context/museum-context'

export function FloatingMapButton() {
  const { mapOpen, openMap, visitedCount } = useMuseum()

  if (mapOpen) return null

  return (
    <button
      type="button"
      onClick={openMap}
      aria-haspopup="dialog"
      aria-label="Open the museum map"
      className="museum-map-trigger group fixed right-4 bottom-4 z-[60] flex h-12 w-12 items-center justify-center gap-2.5 rounded-sm border border-gold/50 bg-charcoal/95 p-2 text-cream shadow-[0_12px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all hover:border-gold-bright hover:bg-charcoal sm:right-6 sm:bottom-6 sm:h-auto sm:w-auto sm:gap-3 sm:pr-4 sm:pl-3"
    >
      <span className="grid h-7 w-7 place-items-center rounded-sm border border-gold/40 bg-gold/10 text-gold-bright transition-colors group-hover:bg-gold/20">
        <Map className="h-3.5 w-3.5" />
      </span>
      <span className="hidden font-mono text-[10px] font-medium tracking-[0.18em] text-cream uppercase sm:inline">
        Map
      </span>
      <span className="hidden font-mono text-[9px] text-muted sm:inline">
        {visitedCount}/8
      </span>
    </button>
  )
}
