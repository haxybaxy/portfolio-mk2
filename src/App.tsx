import { useEffect, useState } from 'react'
import MorphingBackground from './background/MorphingBackground'
import Nav from './components/Nav'
import SocialLinks from './components/SocialLinks'
import TextFade from './components/TextFade'
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
      <Nav items={sections} activeIndex={activeIndex} />
      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center p-6">
        <div className="pointer-events-auto relative isolate">
          <TextFade />
          <SocialLinks />
        </div>
      </footer>
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
