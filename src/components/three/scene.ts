import { createContext, useContext } from 'react'

export type ProgressRef = { current: number }

export const SceneProgressContext = createContext<ProgressRef | null>(null)

export function useSceneProgress() {
  const progress = useContext(SceneProgressContext)
  if (!progress) throw new Error('useSceneProgress must be used inside MuseumScene')
  return progress
}

export type ScenePhases = {
  approach: number
  gate: number
  doors: number
  beam: number
  lamp: number
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (value: number) => value * value * (3 - 2 * value)

export function phase(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0
  return smooth(clamp01((progress - start) / (end - start)))
}

export function getScenePhases(progress: number): ScenePhases {
  return {
    approach: phase(progress, 0.02, 0.78),
    gate: phase(progress, 0.03, 0.2),
    doors: phase(progress, 0.52, 0.9),
    beam: phase(progress, 0.72, 1),
    lamp: 0.35 + 0.65 * phase(progress, 0.04, 0.52),
  }
}
