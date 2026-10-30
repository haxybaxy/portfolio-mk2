import { useState } from 'react'

const STORAGE_KEY = 'theme'

/** Light/dark toggle backed by the `dark` class on <html>, which index.html sets before first paint */
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // Storage can be unavailable (privacy modes); the theme still switches for this visit
    }
    setDark(next)
  }

  return { dark, toggle }
}
