import { useEffect, useState } from 'react'

/** "#/projects/skoll" -> ["projects", "skoll"]; "" or "#/" -> [] */
export function parseHash(hash: string) {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '')
  return path ? path.split('/').map(decodeURIComponent) : []
}

/** Current hash route as path segments; re-renders on navigation */
export function useRoute() {
  const [segments, setSegments] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const update = () => setSegments(parseHash(window.location.hash))
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  return segments
}

/** Build a hash link: href('projects', 'skoll') -> "#/projects/skoll" */
export const href = (...segments: string[]) => `#/${segments.map(encodeURIComponent).join('/')}`
