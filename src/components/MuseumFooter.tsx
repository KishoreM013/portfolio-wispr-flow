import { Mail } from 'lucide-react'
import { site } from '../data/museum'
import { LinkedInIcon } from './BrandIcons'

export function MuseumFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-line/60">
      <div className="container-museum flex flex-col gap-4 pt-7 pb-24 sm:flex-row sm:items-center sm:justify-between sm:pb-20">
        <div>
          <p className="font-display text-xl text-cream">{site.name}</p>
          <p className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
            The Museum of Kishore · {site.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-line px-3 py-2 text-xs text-cream-dim transition-colors hover:border-gold/50 hover:text-gold-bright"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-line px-3 py-2 text-xs text-cream-dim transition-colors hover:border-gold/50 hover:text-gold-bright"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Email
          </a>
        </div>

        <p className="max-w-[220px] font-mono text-[9px] leading-relaxed tracking-[0.12em] text-muted/80 uppercase sm:text-right">
          Built with my voice using Wispr Flow
        </p>
      </div>
    </footer>
  )
}
