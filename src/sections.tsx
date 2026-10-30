import type { ComponentType } from 'react'
import type { Shape } from './background/grainMorphShader'
import About from './pages/About'
import Blog from './pages/Blog'
import Experience from './pages/Experience'
import Home from './pages/Home'
import Projects from './pages/Projects'

export type Background = {
  colors: [string, string, string, string]
  colorBack: string
  shape: Shape
  softness?: number
  intensity?: number
  noise?: number
  scale?: number
}

type Section = {
  id: string
  label: string
  Component: ComponentType
  background: Background
}

export const sections: Section[] = [
  {
    id: 'home',
    label: 'Home',
    Component: Home,
    background: {
      colors: ['#7300ff', '#eba8ff', '#00bfff', '#2b00ff'],
      colorBack: '#000000',
      shape: 'corners',
    },
  },
  {
    id: 'about',
    label: 'About',
    Component: About,
    background: {
      colors: ['#ff6a00', '#ffb347', '#ff2e63', '#7a1fa2'],
      colorBack: '#0a0000',
      shape: 'wave',
    },
  },
  {
    id: 'experience',
    label: 'Experience',
    Component: Experience,
    background: {
      colors: ['#ffd000', '#ff7a00', '#ff0055', '#1a0033'],
      colorBack: '#0a0500',
      shape: 'ripple',
    },
  },
  {
    id: 'projects',
    label: 'Projects',
    Component: Projects,
    background: {
      colors: ['#00ff9d', '#00bfa6', '#0077ff', '#003b2f'],
      colorBack: '#000a06',
      shape: 'truchet',
    },
  },
  {
    id: 'blog',
    label: 'Writing',
    Component: Blog,
    background: {
      colors: ['#ff4ecd', '#7cf4ff', '#4b6bff', '#1b0a3a'],
      colorBack: '#05000a',
      shape: 'blob',
    },
  },
]

export const backgrounds = sections.map((section) => section.background)
