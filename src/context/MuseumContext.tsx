import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { roomIds, type RoomId } from '../data/museum'
import { MuseumContext } from './museum-context'

const STORAGE_KEY = 'museum-of-kishore:visited'

function readVisited(): Set<RoomId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id): id is RoomId => roomIds.includes(id as RoomId)))
  } catch {
    return new Set()
  }
}

export function MuseumProvider({ children }: { children: ReactNode }) {
  const [visited, setVisited] = useState<Set<RoomId>>(readVisited)
  const [mapOpen, setMapOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]))
    } catch {
      // Storage can be unavailable in private mode; the museum still works.
    }
  }, [visited])

  const markVisited = useCallback((id: RoomId) => {
    setVisited((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      return next
    })
  }, [])

  const openMap = useCallback(() => setMapOpen(true), [])
  const closeMap = useCallback(() => setMapOpen(false), [])

  const value = useMemo(
    () => ({
      visited,
      visitedCount: visited.size,
      markVisited,
      mapOpen,
      openMap,
      closeMap,
    }),
    [visited, markVisited, mapOpen, openMap, closeMap],
  )

  return <MuseumContext.Provider value={value}>{children}</MuseumContext.Provider>
}
