import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'
import { REVEAL, REVEAL_HIDDEN } from '../motion'

/** Fades its children up the first time they scroll into view; `delay` (ms) staggers siblings */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${REVEAL} ${shown ? '' : REVEAL_HIDDEN} ${className}`}
    >
      {children}
    </div>
  )
}

export default Reveal
