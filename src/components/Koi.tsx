import { useEffect, useState } from 'react'
import art from './koi.txt?raw'

const LINES = art.replace(/\s+$/, '').split('\n')
const COLS = Math.max(...LINES.map((line) => line.length))
const ROWS = LINES.length
const KOI = LINES.join('\n')

// JetBrains Mono advances 0.6em per glyph and each row is 1em with leading-none, so the
// art is (0.6 * COLS)em wide and ROWS em tall. Fit it to the width and height budgets the
// wrapper sets, and never let a cell grow past 14px or the glyphs stop reading as tone.
const FONT_SIZE = `min(calc(var(--koi-w) / ${(COLS * 0.6).toFixed(1)}), calc(var(--koi-h) / ${ROWS}), 0.875rem)`

function Koi({ className = '' }: { className?: string }) {
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
        aria-hidden="true"
        style={{ fontSize: FONT_SIZE }}
        className={`font-mono leading-none whitespace-pre text-white/60 antialiased select-none [font-variant-ligatures:none] transition-opacity duration-1000 ease-out motion-reduce:transition-none ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        {KOI}
      </pre>
    </div>
  )
}

export default Koi
