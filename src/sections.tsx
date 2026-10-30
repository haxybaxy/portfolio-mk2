import type { ComponentType } from 'react'
import About from './pages/About'
import Experience from './pages/Experience'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Writing from './pages/Writing'

type Section = { id: string; label: string; Component: ComponentType }

// One scrolling page; the nav jumps between these anchors
export const sections: Section[] = [
  { id: 'home', label: 'Home', Component: Home },
  { id: 'about', label: 'About', Component: About },
  { id: 'experience', label: 'Experience', Component: Experience },
  { id: 'projects', label: 'Projects', Component: Projects },
  { id: 'writing', label: 'Writing', Component: Writing },
]
