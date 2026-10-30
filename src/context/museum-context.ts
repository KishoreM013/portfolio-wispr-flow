import { createContext, useContext } from 'react'
import type { RoomId } from '../data/museum'

export type MuseumContextValue = {
  visited: Set<RoomId>
  visitedCount: number
  markVisited: (id: RoomId) => void
  mapOpen: boolean
  openMap: () => void
  closeMap: () => void
}

export const MuseumContext = createContext<MuseumContextValue | null>(null)

export function useMuseum() {
  const context = useContext(MuseumContext)
  if (!context) throw new Error('useMuseum must be used inside MuseumProvider')
  return context
}
