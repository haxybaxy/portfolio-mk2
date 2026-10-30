import { GITHUB_URL, LINKEDIN_URL } from '../contact'
import { useCopyEmail } from '../hooks/useCopyEmail'
import { ICON_MOTION } from '../motion'
import CopiedToast from './CopiedToast'
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
