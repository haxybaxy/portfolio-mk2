import { useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'theme'
const FADE_CLASS = 'theme-fade'
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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      apply()
    } else if (typeof document.startViewTransition === 'function') {
      // Crossfade the whole page between the two palettes
      document.startViewTransition(apply)
    } else {
      // Fallback: let colours interpolate for a moment
      root.classList.add(FADE_CLASS)
      apply()
      window.setTimeout(() => root.classList.remove(FADE_CLASS), FADE_MS)
    }
  }

  return { dark, toggle }
}
