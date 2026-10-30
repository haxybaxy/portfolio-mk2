import { Check } from 'pixelarticons/react/Check.js'
import { Github } from 'pixelarticons/react/Github.js'
import { Linkedin } from 'pixelarticons/react/Linkedin.js'
import { Mail } from 'pixelarticons/react/Mail.js'
import { GITHUB_URL, LINKEDIN_URL } from '../contact'
import { useCopyEmail } from '../hooks/useCopyEmail'
import { ICON_MOTION } from '../motion'

const links = [
  { label: 'LinkedIn', href: LINKEDIN_URL, Icon: Linkedin },
  { label: 'GitHub', href: GITHUB_URL, Icon: Github },
]

const ITEM_CLASS = 'block cursor-pointer opacity-70 transition-opacity hover:opacity-100'

// 24px matches the icons' 24×24 grid so pixels stay crisp
const ICON_SIZE = { width: 24, height: 24, shapeRendering: 'crispEdges' } as const

/** Mail icon that copies the address, swapping to a check while "copied" */
function CopyEmailIcon() {
  const { copied, copy } = useCopyEmail()

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      title={copied ? 'Copied!' : 'Copy email'}
      className={ITEM_CLASS}
    >
      <span className="grid size-6 overflow-hidden" aria-hidden="true">
        <Mail {...ICON_SIZE} className={`[grid-area:1/1] ${ICON_MOTION} ${copied ? 'translate-y-2 opacity-0' : ''}`} />
        <Check {...ICON_SIZE} className={`[grid-area:1/1] ${ICON_MOTION} ${copied ? 'delay-150' : '-translate-y-2 opacity-0'}`} />
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied!' : ''}
      </span>
    </button>
  )
}

function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      <li>
        <CopyEmailIcon />
      </li>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a href={href} aria-label={label} title={label} target="_blank" rel="noreferrer" className={ITEM_CLASS}>
            <Icon {...ICON_SIZE} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialLinks
