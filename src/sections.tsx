import type { ComponentType } from 'react'
import About from './pages/About'
import Contact from './pages/Contact'
import Experience from './pages/Experience'
import Home from './pages/Home'
import Projects from './pages/Projects'

type Section = {
  id: string
  label: string
  Component: ComponentType
  /** Vertically centred in its screen; only for sections whose height never changes */
  centered?: boolean
}

// One scrolling page; the nav jumps between these anchors. Writing is hidden for now (src/pages/Writing.tsx).
export const sections: Section[] = [
  { id: 'home', label: 'Home', Component: Home, centered: true },
  { id: 'about', label: 'About', Component: About },
  { id: 'experience', label: 'Experience', Component: Experience },
  { id: 'projects', label: 'Projects', Component: Projects },
  { id: 'contact', label: 'Contact', Component: Contact, centered: true },
]
