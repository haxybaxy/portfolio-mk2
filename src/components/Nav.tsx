import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { href } from '../router'
import Icon from './Icon'

type NavItem = { id: string; label: string }

const linkTo = (id: string) => (id === 'home' ? '#/' : href(id))

const MOTION = 'transition-[opacity,translate,rotate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
const ICON_BUTTON = 'pointer-events-auto absolute top-5 z-10 grid size-10 cursor-pointer place-items-center'

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`${ICON_BUTTON} right-16 opacity-70 transition-opacity hover:opacity-100 md:right-5`}
    >
      <Icon name={dark ? 'sun' : 'moon'} className="size-5" />
    </button>
  )
}

function Nav({ items, activeId }: { items: NavItem[]; activeId: string }) {
  const [open, setOpen] = useState(false)

  // Lock page scroll and listen for Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 48rem)')
    const onChange = () => desktop.matches && setOpen(false)
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center p-6 text-sm">
      {/* Desktop: inline links */}
      <div className="pointer-events-auto hidden gap-6 md:flex">
        {items.map(({ id, label }) => (
          <a
            key={id}
            href={linkTo(id)}
            aria-current={id === activeId ? 'page' : undefined}
            className={id === activeId ? 'font-bold' : 'opacity-70 hover:opacity-100'}
          >
            {label}
          </a>
        ))}
      </div>

      <ThemeToggle />

      {/* Mobile: toggle button, stays above the overlay so it doubles as the close button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className={`${ICON_BUTTON} right-5 md:hidden`}
      >
        <Icon name="menu" className={`size-5 [grid-area:1/1] ${MOTION} ${open ? 'rotate-90 opacity-0' : ''}`} />
        <Icon name="close" className={`size-5 [grid-area:1/1] ${MOTION} ${open ? '' : '-rotate-90 opacity-0'}`} />
      </button>

      {/* Mobile: full-screen menu */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`pointer-events-auto fixed inset-0 flex flex-col items-center justify-center gap-6 bg-bg/80 backdrop-blur-xl md:hidden ${MOTION} ${open ? '' : 'pointer-events-none opacity-0'}`}
      >
        {items.map(({ id, label }, i) => (
          <a
            key={id}
            href={linkTo(id)}
            onClick={() => setOpen(false)}
            aria-current={id === activeId ? 'page' : undefined}
            style={{ transitionDelay: open ? `${60 + i * 50}ms` : '0ms' }}
            className={`text-4xl tracking-tight ${MOTION} ${id === activeId ? 'font-bold' : ''} ${open ? (id === activeId ? '' : 'opacity-70') : 'translate-y-4 opacity-0'}`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Nav
