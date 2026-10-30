import { Check } from 'pixelarticons/react/Check.js'
import { Mail } from 'pixelarticons/react/Mail.js'
import { useCopyEmail } from '../hooks/useCopyEmail'
import { ICON_MOTION, TEXT_MOTION } from '../motion'

function CopyEmail() {
  const { copied, copy } = useCopyEmail()

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
