import { MapPin } from 'pixelarticons/react/MapPin.js'
import Koi from '../components/Koi'
import SocialLinks from '../components/SocialLinks'
import { REVEAL } from '../motion'
import { PIXEL_ICON } from '../surface'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-16">
      {/* Name first in the DOM: stacks above the koi on phones, sits to its left on wider screens */}
      <div className={`flex flex-col items-center gap-3 text-center md:items-end md:text-right ${REVEAL}`}>
        <h1 className="text-2xl tracking-tight md:text-3xl">Zaid Alsaheb</h1>
        <p className="flex items-center gap-2 opacity-70">
          <MapPin {...PIXEL_ICON} />
          Madrid, Spain
        </p>
        <SocialLinks className="mt-2" />
      </div>
      <Koi />
    </div>
  )
}

export default Home
