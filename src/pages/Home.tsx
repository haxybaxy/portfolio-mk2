import { MapPin } from 'pixelarticons/react/MapPin.js'
import CopyEmail from '../components/CopyEmail'

function Home() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="flex flex-col items-center leading-none">
        <span className="text-[clamp(1rem,3vw,1.75rem)]">What's up, I'm</span>
        <span className="text-[clamp(5rem,22vw,16rem)] font-bold tracking-tighter">Zaid</span>
      </h1>
      <div className="flex flex-col items-center gap-2">
        <p className="flex items-center gap-2 opacity-80">
          <MapPin width={24} height={24} shapeRendering="crispEdges" aria-hidden="true" />
          Madrid, Spain
        </p>
        <CopyEmail />
      </div>
    </div>
  )
}

export default Home
