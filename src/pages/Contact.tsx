import SocialLinks from '../components/SocialLinks'
import { EMAIL } from '../contact'
import { LINK, MUTED, SECTION_TITLE } from '../surface'

function Contact() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <h2 className={SECTION_TITLE}>Contact</h2>

      <div className="flex flex-col gap-5">
        <p className="text-2xl font-bold tracking-tight md:text-3xl">Say hi.</p>
        <p className="leading-relaxed opacity-80">
          Work, collaborations, a strongly held opinion about tabs versus spaces: all of it goes to my business email.
        </p>
        <a href={`mailto:${EMAIL}`} className={`self-start text-lg font-bold md:text-xl ${LINK}`}>
          {EMAIL}
        </a>
        <p className={MUTED}>Yes, &ldquo;him&rdquo;. It was available.</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="opacity-80">I read everything and reply to most of it. The koi handles the rest.</p>
        <SocialLinks />
      </div>
    </div>
  )
}

export default Contact
