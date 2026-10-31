import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { PRESS, SWAP } from '../motion'
import Icon from './Icon'

type NavItem = { id: string; label: string }

const ICON_BUTTON = `pointer-events-auto absolute top-5 z-10 grid size-10 cursor-pointer place-items-center ${PRESS}`
// Hidden while scrolling down. Focus brings it back so keyboard users can still reach the links.
const HIDEABLE = 'transition-[opacity,translate] duration-400'
const HIDDEN =
  '-translate-y-4 opacity-0 pointer-events-none! focus-within:translate-y-0 focus-within:opacity-100 focus-within:pointer-events-auto!'
/** Distance to travel in one direction before the nav reacts, so trackpad jitter cannot flicker it */
const SCROLL_SLACK = 16
/** Near the top of the page the nav always shows */
const TOP_ZONE = 80

/** Quiet time after the last scroll event that counts as the scroll having finished */
const SETTLE_MS = 150
/** A link that turns out not to scroll at all (already there) settles after this */
const NO_SCROLL_MS = 400
/** After a link jump lands, the underline sits on the new section this long before the nav hides */
const LINGER_MS = 1000

/**
 * True after scrolling down a little, false again after scrolling up a little or near the top.
 * A jump from an in-page link keeps the nav up while it scrolls, so the underline can follow along,
 * then lingers on the new section before hiding.
 */
function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    // Where the current scroll direction started
    let turn = last
    let direction = 0
    let frame = 0
    // Set while a link's smooth scroll is running
    let jumpFrom: number | null = null
    let settleTimer = 0
    let lingerTimer = 0

    /** true to hide, false to show, null to leave it as it is */
    const decide = (y: number, from: number, dir: number) => {
      if (y < TOP_ZONE) return false
      if (dir > 0 && y - from > SCROLL_SLACK) return true
      if (dir < 0 && from - y > SCROLL_SLACK) return false
      return null
    }

    const finishJump = () => {
      if (jumpFrom === null) return
      const y = window.scrollY
      const hide = decide(y, jumpFrom, Math.sign(y - jumpFrom))
      if (hide) lingerTimer = window.setTimeout(() => setHidden(true), LINGER_MS)
      else if (hide === false) setHidden(false)
      jumpFrom = null
      last = turn = y
      direction = 0
    }

    const update = () => {
      frame = 0
      const y = window.scrollY
      const next = Math.sign(y - last)
      if (next !== 0 && next !== direction) {
        direction = next
        turn = last
      }
      last = y
      const hide = decide(y, turn, direction)
      if (hide !== null) setHidden(hide)
    }

    const onScroll = () => {
      if (jumpFrom !== null) {
        window.clearTimeout(settleTimer)
        settleTimer = window.setTimeout(finishJump, SETTLE_MS)
        return
      }
      // Scrolling by hand takes over from a pending linger
      window.clearTimeout(lingerTimer)
      // At most one check per frame
      if (!frame) frame = requestAnimationFrame(update)
    }

    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      if (!link) return
      jumpFrom = window.scrollY
      window.clearTimeout(settleTimer)
      window.clearTimeout(lingerTimer)
      settleTimer = window.setTimeout(finishJump, NO_SCROLL_MS)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, true)
      cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
      window.clearTimeout(lingerTimer)
    }
  }, [])

  return hidden
}

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
function DesktopLinks({ items, activeId, hidden }: { items: NavItem[]; activeId: string; hidden: boolean }) {
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
    <div ref={rowRef} className={`pointer-events-auto relative hidden gap-6 md:flex ${HIDEABLE} ${hidden ? HIDDEN : ''}`}>
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
  const scrolledDown = useHideOnScrollDown()
  // The open mobile menu needs its close button
  const hidden = scrolledDown && !open

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
      <DesktopLinks items={items} activeId={activeId} hidden={hidden} />

      <ThemeToggle />

      {/* Mobile: toggle button, stays above the overlay so it doubles as the close button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        // Keeps the press scale alongside the hide fade
        className={`${ICON_BUTTON} right-5 transition-[opacity,translate,scale] duration-400 md:hidden ${hidden ? HIDDEN : ''}`}
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
