import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** New room, new view. Keeps scroll position predictable between exhibits. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
