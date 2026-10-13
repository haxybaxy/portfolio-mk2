import { useEffect, useState } from 'react'
import MorphingBackground from './background/MorphingBackground'
import { getScrollProgress } from './scrollProgress'
import { backgrounds, sections } from './sections'

function App() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const update = () => setActiveIndex(Math.round(getScrollProgress(sections.length)))
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      <MorphingBackground className="fixed inset-0 -z-10 h-screen w-screen" stops={backgrounds} />
      <nav className="fixed inset-x-0 top-0 z-10 flex justify-center gap-6 p-6 text-sm">
        {sections.map(({ id, label }, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className={i === activeIndex ? 'font-bold' : 'opacity-70 hover:opacity-100'}
          >
            {label}
          </a>
        ))}
      </nav>
      <main>
        {sections.map(({ id, Component }) => (
          <section key={id} id={id} className="grid min-h-svh place-items-center px-4 py-24">
            <Component />
          </section>
        ))}
      </main>
    </>
  )
}

export default App
