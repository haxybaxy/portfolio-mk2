/**
 * Scroll position as a fractional section index: 0 at the top, 1 when the second
 * section's top reaches the top of the viewport, and so on. Uses each section's
 * real position, so sections taller than the screen still map correctly.
 */
export function getScrollProgress(sectionCount: number) {
  const sections = document.querySelectorAll<HTMLElement>('main > section')
  if (sections.length < 2) return 0

  const y = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  if (y >= maxScroll - 1) return sectionCount - 1

  const tops = Array.from(sections, (section) => section.getBoundingClientRect().top + y)
  let index = 0
  while (index < tops.length - 1 && tops[index + 1] <= y) index++
  if (index === tops.length - 1) return index

  return index + (y - tops[index]) / (tops[index + 1] - tops[index])
}
