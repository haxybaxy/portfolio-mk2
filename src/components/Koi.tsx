import art from './koi.txt?raw'

const LINES = art.replace(/\s+$/, '').split('\n')
const ROWS = LINES.length
const KOI = LINES.join('\n')

// Each row is 1em with leading-none, so the art is ROWS em tall; size it from the height the parent sets.
const FONT_SIZE = `calc(var(--koi-h, 12rem) / ${ROWS})`

function Koi({ className = '' }: { className?: string }) {
  return (
    // Ligatures must stay off: JetBrains Mono would fuse runs like // and || and break the grid
    <pre
      role="img"
      aria-label="A koi fish drawn in ASCII characters"
      style={{ fontSize: FONT_SIZE }}
      className={`font-mono leading-none whitespace-pre text-white/50 antialiased [font-variant-ligatures:none] ${className}`}
    >
      {KOI}
    </pre>
  )
}

export default Koi
