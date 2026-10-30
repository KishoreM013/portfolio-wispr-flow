import { useEffect, useState } from 'react'

/** Tracks the user's reduced-motion preference and reacts to changes. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** Media-query state updates when rotating, resizing, or changing input devices. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

/** Lower rendering cost on touch devices, small screens, and data-saving devices. */
export function useLiteMode() {
  const mobile = useMediaQuery('(max-width: 767px), (pointer: coarse)')
  const [lowPower] = useState(() => {
    if (typeof window === 'undefined') return false
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    return Boolean(connection?.saveData) || (navigator.hardwareConcurrency ?? 8) <= 4 || (deviceMemory !== undefined && deviceMemory <= 4)
  })
  return mobile || lowPower
}
