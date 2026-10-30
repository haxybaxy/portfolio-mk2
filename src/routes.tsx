import type { ComponentType } from 'react'
import About from './pages/About'
import Experience from './pages/Experience'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Writing from './pages/Writing'

/** Path segments after the section, e.g. ["skoll"] for #/projects/skoll */
export type PageProps = { params: string[] }

export type Route = { id: string; label: string; Component: ComponentType<PageProps> }

// The first entry is the landing page and the fallback for unknown paths
export const routes: Route[] = [
  { id: 'home', label: 'Home', Component: Home },
  { id: 'about', label: 'About', Component: About },
  { id: 'experience', label: 'Experience', Component: Experience },
  { id: 'projects', label: 'Projects', Component: Projects },
  { id: 'writing', label: 'Writing', Component: Writing },
]
