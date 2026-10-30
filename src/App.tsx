import { useEffect, useRef } from 'react'
import Nav from './components/Nav'
import { useRoute } from './router'
import { routes } from './routes'

function App() {
  const segments = useRoute()
  const route = routes.find((candidate) => candidate.id === segments[0]) ?? routes[0]
  const params = route.id === segments[0] ? segments.slice(1) : []

  // Entering a different page: start at the top and name the tab. Moving within a page keeps the scroll position.
  const previousId = useRef(route.id)
  useEffect(() => {
    if (previousId.current !== route.id) window.scrollTo({ top: 0, behavior: 'instant' })
    previousId.current = route.id
    document.title = route.id === 'home' ? 'Zaid Alsaheb' : `${route.label} · Zaid Alsaheb`
  }, [route])

  const View = route.Component
  const isHome = route.id === 'home'

  return (
    <>
      <Nav items={routes} activeId={route.id} />
      <main
        className={
          isHome
            ? 'flex min-h-svh flex-col items-center justify-center px-6 py-24'
            : 'mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center px-6 pt-28 pb-24'
        }
      >
        <View params={params} />
      </main>
    </>
  )
}

export default App
