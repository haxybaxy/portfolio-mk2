import { GITHUB_URL, LINKEDIN_URL } from '../contact'
import { useCopyEmail } from '../hooks/useCopyEmail'
import { ICON_MOTION, TEXT_MOTION } from '../motion'
import Icon, { type IconName } from './Icon'

const ITEM = 'block cursor-pointer opacity-70 transition-opacity hover:opacity-100'
const SIZE = 'size-7'

/** Mail icon that copies the address, swapping to a check while "copied" */
function CopyEmailIcon() {
  const { copied, copy } = useCopyEmail()

  return (
    <>
      <CopiedToast visible={copied} />
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        title={copied ? 'Copied!' : 'Copy email'}
        className={ITEM}
      >
        <span className={`grid ${SIZE} overflow-hidden`} aria-hidden="true">
          <Icon name="mail" className={`${SIZE} [grid-area:1/1] ${ICON_MOTION} ${copied ? 'translate-y-2 opacity-0' : ''}`} />
          <Icon
            name="check"
            className={`${SIZE} [grid-area:1/1] ${ICON_MOTION} ${copied ? 'delay-150' : '-translate-y-2 opacity-0'}`}
          />
        </span>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email copied to clipboard' : ''}
        </span>
      </button>
    </>
  )
}

/** Fixed pill at the bottom of the viewport while the address is on the clipboard */
function CopiedToast({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center px-6 ${TEXT_MOTION} ${visible ? '' : 'translate-y-2 opacity-0'}`}
    >
      <span className="flex items-center gap-2 rounded-full border border-fg/15 bg-bg px-4 py-2 text-sm shadow-lg shadow-black/20">
        <Icon name="check" />
        Email copied to clipboard
      </span>
    </div>
  )
}

const links: { label: string; href: string; icon: IconName }[] = [
  { label: 'GitHub', href: GITHUB_URL, icon: 'github' },
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: 'linkedin' },
]

function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-7 ${className}`}>
      <li>
        <CopyEmailIcon />
      </li>
      {links.map(({ label, href, icon }) => (
        <li key={label}>
          <a href={href} aria-label={label} title={label} target="_blank" rel="noreferrer" className={ITEM}>
            <Icon name={icon} className={SIZE} />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialLinks
