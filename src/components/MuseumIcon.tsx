import {
  BadgeCheck,
  Archive,
  Feather,
  Frame,
  GitPullRequest,
  HeartHandshake,
  Medal,
  Sparkles,
  Ticket,
  Trophy,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  trophy: Trophy,
  heart: HeartHandshake,
  medal: Medal,
  git: GitPullRequest,
  feather: Feather,
  frame: Frame,
  badge: BadgeCheck,
  archive: Archive,
  ticket: Ticket,
  wrench: Wrench,
}

export function MuseumIcon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string
  className?: string
  strokeWidth?: number
}) {
  const Icon = icons[name] ?? Sparkles
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}
