import { useState } from 'react'
import { flushSync } from 'react-dom'
import { reducedMotion } from '../motion'

const STORAGE_KEY = 'theme'
const FADE_CLASS = 'theme-fade'
// On <html> while the crossfade runs, so index.css can give it its own timing
const VT_CLASS = 'vt-theme'
const FADE_MS = 450

/** Light/dark toggle backed by the `dark` class on <html>, which index.html sets before first paint */
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = () => {
    const next = !dark
    const root = document.documentElement
    const apply = () => {
      root.classList.toggle('dark', next)
      // Render the icon swap now so it lands inside the same transition as the colour change
      flushSync(() => setDark(next))
    }
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // Storage can be unavailable (privacy modes); the theme still switches for this visit
    }

    if (reducedMotion()) {
      apply()
    } else if (typeof document.startViewTransition === 'function') {
      // Crossfade the whole page between the two palettes
      root.classList.add(VT_CLASS)
      const done = () => root.classList.remove(VT_CLASS)
      document.startViewTransition(apply).finished.then(done, done)
    } else {
      // Fallback: let colours interpolate for a moment
      root.classList.add(FADE_CLASS)
      apply()
      window.setTimeout(() => root.classList.remove(FADE_CLASS), FADE_MS)
    }
  }

  return { dark, toggle }
}
