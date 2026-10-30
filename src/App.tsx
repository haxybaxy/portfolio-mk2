import Home from './pages/Home'

// Landing only for now: the other sections stay in src/pages but are not wired in on this branch
function App() {
  return (
    <main className="grid min-h-svh place-items-center px-6 py-12">
      <Home />
    </main>
  )
}

export default App
