import type { ReactNode } from 'react'
import { EXPAND, FADE } from '../motion'

type Props = {
  /** Prefix for the panel id (`${id}-panel`), linked from the button via aria-controls */
  id: string
  open: boolean
  onToggle: () => void
  /** The always-visible row, rendered inside the toggle button */
  summary: ReactNode
  summaryClassName?: string
  /** Spacing above the content goes here as padding: a margin on the clipped box would survive the collapse */
  contentClassName?: string
  children: ReactNode
}

/**
 * Button plus a panel whose height animates in every browser (grid rows 0fr → 1fr).
 * Opening: height first, content fades up a beat later. Closing: content fades, then the height follows.
 * Collapsed content is inert, so it leaves the tab order and the accessibility tree.
 */
function Disclosure({ id, open, onToggle, summary, summaryClassName = '', contentClassName = '', children }: Props) {
  const panelId = `${id}-panel`

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`w-full cursor-pointer text-left ${summaryClassName}`}
      >
        {summary}
      </button>
      <div id={panelId} inert={!open} className={`grid ${EXPAND} ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] delay-75'}`}>
        {/* -mx-1 px-1 leaves room for focus rings, which overflow-hidden would otherwise clip at the edges */}
        <div className="-mx-1 min-h-0 overflow-hidden px-1">
          <div className={`${FADE} ${open ? 'delay-100' : 'translate-y-1 opacity-0'} ${contentClassName}`}>{children}</div>
        </div>
      </div>
    </>
  )
}

export default Disclosure
