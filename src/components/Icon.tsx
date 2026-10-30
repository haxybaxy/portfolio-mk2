// UI glyphs from Teenyicons (MIT, 15px grid, 1px strokes), inlined from the package's SVG files
import alien from 'teenyicons/outline/alien.svg?raw'
import arrowRight from 'teenyicons/outline/arrow-right.svg?raw'
import briefcase from 'teenyicons/outline/briefcase.svg?raw'
import down from 'teenyicons/outline/down.svg?raw'
import envelope from 'teenyicons/outline/envelope.svg?raw'
import github from 'teenyicons/outline/github.svg?raw'
import linkedin from 'teenyicons/outline/linkedin.svg?raw'
import menu from 'teenyicons/outline/menu.svg?raw'
import moon from 'teenyicons/outline/moon.svg?raw'
import pin from 'teenyicons/outline/pin.svg?raw'
import sun from 'teenyicons/outline/sun.svg?raw'
import tick from 'teenyicons/outline/tick.svg?raw'
import topRight from 'teenyicons/outline/top-right.svg?raw'
import x from 'teenyicons/outline/x.svg?raw'

const ICONS = {
  alien,
  arrowRight,
  briefcase,
  check: tick,
  chevronDown: down,
  close: x,
  externalLink: topRight,
  github,
  linkedin,
  mail: envelope,
  menu,
  moon,
  pin,
  sun,
} as const

export type IconName = keyof typeof ICONS

/** Decorative inline icon drawn in the current text colour; size it with a `size-*` class */
function Icon({ name, className = 'size-4' }: { name: IconName; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 [&>svg]:size-full ${className}`}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  )
}

export default Icon
