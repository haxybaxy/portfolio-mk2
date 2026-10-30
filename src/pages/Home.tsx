import Koi from '../components/Koi'
import SocialLinks from '../components/SocialLinks'

function Home() {
  return (
    <div className="flex w-full max-w-5xl flex-col-reverse items-center justify-center gap-12 md:flex-row md:justify-between md:gap-16">
      <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Zaid Alsaheb</h1>
          <p className="opacity-80 md:text-lg">Computer Science &amp; AI undergrad at IE University. Madrid, Spain.</p>
        </div>
        <SocialLinks />
      </div>
      <Koi className="[--koi-h:38svh] md:[--koi-h:62svh]" />
    </div>
  )
}

export default Home
