import Reveal from '../components/Reveal'
import { MUTED, PANEL, SECTION_TITLE } from '../surface'

const NOW = [
  'Rebuilding this site from scratch',
  'Reading about color science and getting distracted by OKLab',
  'Learning to make pixel icons look good at any size',
  'Drinking too much café con leche',
]

function About() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-12">
      <Reveal>
        <h2 className={SECTION_TITLE}>About</h2>
      </Reveal>

      <Reveal delay={80} className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <img
          src="/myphoto.jpeg"
          alt="Zaid Alsaheb"
          className={`${PANEL} size-36 shrink-0 object-cover sm:size-44`}
          loading="lazy"
        />
        <div className="flex flex-col gap-5 leading-relaxed">
          <p>
            I am currently an undergrad student at IE University, pursuing a bachelors degree in Computer Science and
            Artificial Intelligence. I am very passionate about technology and all of its interconnected facets, which
            drives me to learn about anything and everything.
          </p>
          <div className="flex flex-col gap-2">
            <span className={MUTED}>now</span>
            <ul className="flex list-['→_'] flex-col gap-1 pl-6">
              {NOW.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  )
}

export default About
