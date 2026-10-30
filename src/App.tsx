import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import { POST_ROUTE } from './data/blog'
import Post from './pages/Post'
import { getScrollProgress } from './scrollProgress'
import { sections } from './sections'

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return hash
}

function App() {
  const hash = useHash()
  const postSlug = POST_ROUTE.exec(hash)?.[1]
  const [activeIndex, setActiveIndex] = useState(0)

  // Track the section in view while on the scrolling page
  useEffect(() => {
    if (postSlug) return
    const update = () => setActiveIndex(Math.round(getScrollProgress(sections.length)))
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [postSlug])

  // A post starts at the top. Leaving one, the anchor in the new hash did not exist when the browser
  // looked for it, so jump to it once the page has rendered.
  const wasPost = useRef(Boolean(postSlug))
  useEffect(() => {
    if (postSlug) window.scrollTo({ top: 0, behavior: 'instant' })
    else if (wasPost.current && hash.length > 1) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    wasPost.current = Boolean(postSlug)
  }, [postSlug, hash])

  return (
    <>
      <Nav items={sections} activeId={postSlug ? '' : sections[activeIndex].id} />
      {postSlug ? (
        <main className="flex min-h-svh flex-col items-center px-6 pt-28 pb-24">
          <Post slug={postSlug} />
        </main>
      ) : (
        <main>
          {sections.map(({ id, Component, centered }) => (
            <section
              key={id}
              id={id}
              // Content sections anchor to the top so expanding rows only grow downwards
              className={`flex min-h-svh flex-col items-center px-6 ${centered ? 'justify-center py-24' : 'pt-28 pb-24'}`}
            >
              <Component />
            </section>
          ))}
        </main>
      )}
    </>
  )
}

export default App
