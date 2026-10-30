import { useEffect, useRef, useState } from 'react'

// Fires while the element is still 48px below the viewport, so the fade is under way as it enters.
// threshold 0 (not a fraction): a block taller than the screen would otherwise never reach it.
const OPTIONS: IntersectionObserverInit = { rootMargin: '0px 0px 48px 0px', threshold: 0 }

/** True once the element has (nearly) scrolled into view; stays true, so the reveal plays once */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShown(true)
      observer.disconnect()
    }, OPTIONS)
    observer.observe(el)
    return () => observer.disconnect()
  }, [shown])

  return { ref, shown }
}
