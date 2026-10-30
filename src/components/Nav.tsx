import { Close } from 'pixelarticons/react/Close.js'
import { Menu } from 'pixelarticons/react/Menu.js'
import { useEffect, useState } from 'react'
import TextFade from './TextFade'

type NavItem = { id: string; label: string }

const MOTION = 'transition-[opacity,translate,rotate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

function Nav({ items, activeIndex }: { items: NavItem[]; activeIndex: number }) {
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
      <div className="pointer-events-auto relative isolate hidden gap-6 md:flex">
        <TextFade />
        {items.map(({ id, label }, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className={i === activeIndex ? 'font-bold' : 'opacity-70 hover:opacity-100'}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Mobile: toggle button, stays above the overlay so it doubles as the close button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="pointer-events-auto absolute top-5 right-5 z-10 isolate grid size-10 cursor-pointer place-items-center md:hidden"
      >
        <TextFade />
        {/* 24px matches the icons' 24×24 grid so pixels stay crisp at rest */}
        <Menu
          width={24}
          height={24}
          shapeRendering="crispEdges"
          aria-hidden="true"
          className={`[grid-area:1/1] ${MOTION} ${open ? 'rotate-90 opacity-0' : ''}`}
        />
        <Close
          width={24}
          height={24}
          shapeRendering="crispEdges"
          aria-hidden="true"
          className={`[grid-area:1/1] ${MOTION} ${open ? '' : '-rotate-90 opacity-0'}`}
        />
      </button>

      {/* Mobile: full-screen menu */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`pointer-events-auto fixed inset-0 flex flex-col items-center justify-center gap-6 bg-black/40 backdrop-blur-xl md:hidden ${MOTION} ${open ? '' : 'pointer-events-none opacity-0'}`}
      >
        {items.map(({ id, label }, i) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setOpen(false)}
            aria-current={i === activeIndex ? 'true' : undefined}
            style={{ transitionDelay: open ? `${60 + i * 50}ms` : '0ms' }}
            className={`text-4xl tracking-tight ${MOTION} ${i === activeIndex ? 'font-bold' : ''} ${open ? (i === activeIndex ? '' : 'opacity-70') : 'translate-y-4 opacity-0'}`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Nav
