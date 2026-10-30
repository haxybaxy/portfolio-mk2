import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import { getScrollProgress } from './scrollProgress'
import { sections } from './sections'

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
      <Nav items={sections} activeId={sections[activeIndex].id} />
      <main>
        {sections.map(({ id, Component }) => (
          <section
            key={id}
            id={id}
            // Only the hero is centred; content sections anchor to the top so expanding rows only grow downwards
            className={`flex min-h-svh flex-col items-center px-6 ${id === 'home' ? 'justify-center py-24' : 'pt-28 pb-24'}`}
          >
            <Component />
          </section>
        ))}
      </main>
    </>
  )
}

export default App
