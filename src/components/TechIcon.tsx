import { iconFor } from '../data/icons'

/** Monochrome technology icon in the current text colour; renders nothing when no icon exists */
function TechIcon({ name, className = 'size-4' }: { name: string; className?: string }) {
  const icon = iconFor(name)
  if (!icon) return null

  if (icon.kind === 'path') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 fill-current ${className}`}>
        <path d={icon.path} />
      </svg>
    )
  }
  // Coloured source file flattened to a silhouette: black on light, white on dark
  return (
    <img
      src={icon.src}
      alt=""
      loading="lazy"
      className={`shrink-0 [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)] ${className}`}
    />
  )
}

export default TechIcon
