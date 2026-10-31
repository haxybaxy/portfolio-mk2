import { useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react'
import { FADE } from '../motion'
import { LINK } from '../surface'

export type Card = { image: string; caption: string; tall?: boolean }

type Props = { card: Card; children: ReactNode; className?: string; href?: string }

/** A word with a small preview card (photo and caption) while hovered or focused; a link only when `href` is given */
function Peek({ card, children, className = '', href }: Props) {
  const [open, setOpen] = useState(false)
  // Cards open above the word unless that would run past the top of the viewport (or under the fixed nav)
  const [below, setBelow] = useState(false)

  const show = (event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    setBelow(event.currentTarget.getBoundingClientRect().top < (card.tall ? 440 : 300))
    setOpen(true)
  }
  const handlers = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'touch') show(event)
    },
    onPointerLeave: () => setOpen(false),
    onFocus: show,
    onBlur: () => setOpen(false),
  }

  return (
    <span className="relative">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className={`${LINK} ${className}`} {...handlers}>
          {children}
        </a>
      ) : (
        // Not a link: a dotted underline marks it as something to hover, and it is focusable so keyboards get the card too
        <span
          tabIndex={0}
          className={`cursor-help underline decoration-fg/30 decoration-dotted underline-offset-4 ${className}`}
          {...handlers}
        >
          {children}
        </span>
      )}
      {open && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 z-30 w-56 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-lg border border-fg/15 bg-bg p-1.5 font-normal not-italic shadow-lg shadow-black/20 ${FADE} ${
            below ? 'top-full mt-2 starting:-translate-y-1' : 'bottom-full mb-2 starting:translate-y-1'
          } starting:opacity-0`}
        >
          <img
            src={card.image}
            alt=""
            className={`w-full rounded-md object-cover ${card.tall ? 'aspect-[2/3]' : 'aspect-[16/10]'}`}
          />
          <span className="block px-1 pt-1.5 pb-0.5 text-xs leading-snug opacity-80">{card.caption}</span>
        </span>
      )}
    </span>
  )
}

export default Peek
