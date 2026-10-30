import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { PRESS, SWAP } from '../motion'
import Icon from './Icon'

type NavItem = { id: string; label: string }

const ICON_BUTTON = `pointer-events-auto absolute top-5 z-10 grid size-10 cursor-pointer place-items-center ${PRESS}`
const INDICATOR = 'pointer-events-none absolute -bottom-1 h-px bg-fg transition-[left,width,opacity] duration-300'

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`${ICON_BUTTON} right-16 opacity-70 hover:opacity-100 md:right-5`}
    >
      {/* Both icons share one cell and crossfade, inside the page crossfade when the browser has one */}
      <Icon name="sun" className={`size-5 [grid-area:1/1] ${SWAP} ${dark ? '' : 'rotate-90 opacity-0'}`} />
      <Icon name="moon" className={`size-5 [grid-area:1/1] ${SWAP} ${dark ? '-rotate-90 opacity-0' : ''}`} />
    </button>
  )
}

/** Desktop link row with one bar that slides under the active link */
function DesktopLinks({ items, activeId }: { items: NavItem[]; activeId: string }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  // Placed before paint so the first position never animates; re-measured when the row resizes (viewport, font swap)
  useLayoutEffect(() => {
    const row = rowRef.current
    const bar = barRef.current
    if (!row || !bar) return
    const place = () => {
      const link = row.querySelector<HTMLAnchorElement>('a[aria-current]')
      bar.style.opacity = link ? '1' : '0'
      if (!link) return
      bar.style.left = `${link.offsetLeft}px`
      bar.style.width = `${link.offsetWidth}px`
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(row)
    document.fonts.ready.then(place)
    return () => observer.disconnect()
  }, [activeId])

  return (
    <div ref={rowRef} className="pointer-events-auto relative hidden gap-6 md:flex">
      {items.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={id === activeId ? 'true' : undefined}
          className={`transition-opacity ${id === activeId ? 'font-bold' : 'opacity-70 hover:opacity-100'}`}
        >
          {label}
        </a>
      ))}
      <span ref={barRef} aria-hidden="true" className={INDICATOR} />
    </div>
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
      <DesktopLinks items={items} activeId={activeId} />

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
        <Icon name="menu" className={`size-5 [grid-area:1/1] ${SWAP} ${open ? 'rotate-90 opacity-0' : ''}`} />
        <Icon name="close" className={`size-5 [grid-area:1/1] ${SWAP} ${open ? '' : '-rotate-90 opacity-0'}`} />
      </button>

      {/* Mobile: full-screen menu */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`pointer-events-auto fixed inset-0 flex flex-col items-center justify-center gap-6 bg-bg/80 backdrop-blur-xl md:hidden ${SWAP} ${open ? '' : 'pointer-events-none opacity-0'}`}
      >
        {items.map(({ id, label }, i) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setOpen(false)}
            aria-current={id === activeId ? 'true' : undefined}
            style={{ transitionDelay: open ? `${40 + i * 40}ms` : '0ms' }}
            className={`text-4xl tracking-tight ${SWAP} ${id === activeId ? 'font-bold' : ''} ${open ? (id === activeId ? '' : 'opacity-70') : 'translate-y-4 opacity-0'}`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Nav
