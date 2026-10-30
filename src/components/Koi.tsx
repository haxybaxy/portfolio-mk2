import { Fragment, useEffect, useRef, useState } from 'react'
import { useGlyphRipple } from '../hooks/useGlyphRipple'
import art from './koi.txt?raw'

const LINES = art.replace(/\s+$/, '').split('\n')
const COLS = Math.max(...LINES.map((line) => line.length))
const ROWS = LINES.length

// JetBrains Mono advances 0.6em per glyph and each row is 1em with leading-none, so the
// art is (0.6 * COLS)em wide and ROWS em tall. Fit it to the width and height budgets the
// wrapper sets, and never let a cell grow past 14px or the glyphs stop reading as tone.
const FONT_SIZE = `min(calc(var(--koi-w) / ${(COLS * 0.6).toFixed(1)}), calc(var(--koi-h) / ${ROWS}), 0.875rem)`

/** Split a row into runs of spaces (plain text) and single inked glyphs (one span each, so the hover effect can move them) */
function renderRow(line: string, row: number) {
  const nodes = []
  let spaces = ''
  for (let col = 0; col < line.length; col++) {
    const ch = line[col]
    if (ch === ' ') {
      spaces += ch
      continue
    }
    if (spaces) {
      nodes.push(spaces)
      spaces = ''
    }
    nodes.push(
      <span key={col} data-row={row} data-col={col} className="inline-block">
        {ch}
      </span>,
    )
  }
  if (spaces) nodes.push(spaces)
  return nodes
}

function Koi({ className = '' }: { className?: string }) {
  const preRef = useRef<HTMLPreElement>(null)
  useGlyphRipple(preRef)

  // Wait for the web font so the art never snaps from the fallback mono mid-fade
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      role="img"
      aria-label="A koi fish drawn in ASCII characters"
      className={`overflow-hidden [--koi-h:55svh] [--koi-w:88vw] md:[--koi-h:80svh] md:[--koi-w:42vw] ${className}`}
    >
      {/* Ligatures must stay off: JetBrains Mono would fuse runs like // and || and break the grid */}
      <pre
        ref={preRef}
        aria-hidden="true"
        style={{ fontSize: FONT_SIZE }}
        className={`font-mono leading-none whitespace-pre text-white antialiased selection:bg-white selection:text-black [font-variant-ligatures:none] transition-opacity duration-1000 ease-out motion-reduce:transition-none ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        {LINES.map((line, row) => (
          <Fragment key={row}>
            {row > 0 && '\n'}
            {renderRow(line, row)}
          </Fragment>
        ))}
      </pre>
    </div>
  )
}

export default Koi
