import { useEffect, useState, type PointerEvent, type FocusEvent, type ReactNode } from 'react'
import { FADE } from '../motion'
import { LINK } from '../surface'

type Card = { image?: string; caption: string }
type Props = {
  href: string
  children: ReactNode
  className?: string
  /** Wikipedia article title: its description becomes the caption, and its lead image the photo unless `image` is given */
  wiki?: string
  /** A ready-made card instead of a Wikipedia lookup */
  card?: Card
  /** Photo to show in place of the article's lead image */
  image?: string
  /** Portrait photos get a taller card */
  tall?: boolean
}

const cache = new Map<string, Promise<Card | null>>()

/** Lead image and one-line description of a Wikipedia article, fetched once per title */
function wikiCard(title: string) {
  let pending = cache.get(title)
  if (!pending) {
    pending = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) =>
        data ? { image: data.thumbnail?.source, caption: data.description || data.extract?.split('. ')[0] || title } : null,
      )
      .catch(() => null)
    cache.set(title, pending)
  }
  return pending
}

/** A link that shows a small preview card (photo and caption) while hovered or focused */
function Peek({ href, children, className = '', wiki, card, image, tall = false }: Props) {
  const [open, setOpen] = useState(false)
  // Cards open above the link unless that would run past the top of the viewport (or under the fixed nav)
  const [below, setBelow] = useState(false)
  const [resolved, setResolved] = useState<Card | null>(card ?? null)

  const show = (event: PointerEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
    setBelow(event.currentTarget.getBoundingClientRect().top < (tall ? 440 : 300))
    setOpen(true)
  }

  useEffect(() => {
    if (!open || resolved || !wiki) return
    let cancelled = false
    wikiCard(wiki).then((result) => {
      if (!cancelled && result) setResolved({ image: image ?? result.image, caption: result.caption })
    })
    return () => {
      cancelled = true
    }
  }, [open, resolved, wiki, image])

  return (
    <span className="relative">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${LINK} ${className}`}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') show(event)
        }}
        onPointerLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
      >
        {children}
      </a>
      {open && resolved && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 z-30 w-56 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-lg border border-fg/15 bg-bg p-1.5 font-normal not-italic shadow-lg shadow-black/20 ${FADE} ${
            below ? 'top-full mt-2 starting:-translate-y-1' : 'bottom-full mb-2 starting:translate-y-1'
          } starting:opacity-0`}
        >
          {resolved.image && (
            <img src={resolved.image} alt="" className={`w-full rounded-md object-cover ${tall ? 'aspect-[2/3]' : 'aspect-[16/10]'}`} />
          )}
          <span className="block px-1 pt-1.5 pb-0.5 text-xs leading-snug opacity-80">{resolved.caption}</span>
        </span>
      )}
    </span>
  )
}

export default Peek
