import { CHIP } from '../surface'
import TechIcon from './TechIcon'

/** Technology name with its monochrome icon when one exists */
function TechChip({ name }: { name: string }) {
  return (
    <li className={CHIP}>
      <TechIcon name={name} />
      {name}
    </li>
  )
}

export default TechChip
