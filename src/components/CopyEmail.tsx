import { Check } from 'pixelarticons/react/Check.js'
import { Mail } from 'pixelarticons/react/Mail.js'
import { useEffect, useRef, useState } from 'react'

const EMAIL = ['him', 'zaidalsaheb.com'].join('@')
const RESET_AFTER_MS = 2000

// Shared easing: quick start, long soft landing
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
const ICON_MOTION = `transition-[opacity,translate] duration-700 ${EASE}`
const TEXT_MOTION = `transition-[opacity,translate] duration-500 ${EASE}`

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      return
    }
    setCopied(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), RESET_AFTER_MS)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      className="flex cursor-pointer items-center opacity-80 transition-opacity hover:opacity-100"
    >
      {/* Both rows share one grid cell, so the button keeps the email row's width.
          24px icons match their 24×24 grid so pixels stay crisp at rest. */}
      <span className="grid overflow-hidden" aria-hidden="true">
        <span className="flex items-center gap-2 [grid-area:1/1]">
          <Mail
            width={24}
            height={24}
            shapeRendering="crispEdges"
            className={`${ICON_MOTION} ${copied ? 'translate-y-2 opacity-0' : ''}`}
          />
          <span className={`${TEXT_MOTION} ${copied ? 'translate-y-full opacity-0' : 'delay-100'}`}>
            him[at]zaidalsaheb.com
          </span>
        </span>
        <span className="flex items-center gap-2 justify-self-center [grid-area:1/1]">
          <Check
            width={24}
            height={24}
            shapeRendering="crispEdges"
            className={`${ICON_MOTION} ${copied ? 'delay-150' : '-translate-y-2 opacity-0'}`}
          />
          <span className={`${TEXT_MOTION} ${copied ? 'delay-100' : '-translate-y-full opacity-0'}`}>Copied!</span>
        </span>
      </span>

      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied!' : ''}
      </span>
    </button>
  )
}

export default CopyEmail
