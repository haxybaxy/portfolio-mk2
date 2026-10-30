import GlassWindow from '../components/GlassWindow'
import { skillCategories } from '../data/skills'
import { CARD, PAGE_TITLE } from '../surface'

function About() {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-10">
      <h1 className={PAGE_TITLE}>About</h1>

      <div className={`${CARD} flex w-full flex-col items-center gap-6 p-6 sm:flex-row sm:items-start`}>
        <img
          src="/myphoto.jpeg"
          alt="Zaid Alsaheb"
          className="size-40 shrink-0 rounded-xl object-cover sm:size-48"
          loading="lazy"
        />
        <div className="flex flex-col gap-4 leading-relaxed">
          <p>
            I am currently an <strong>undergrad student at IE University</strong>, pursuing a bachelors degree in{' '}
            <strong>Computer Science and Artificial Intelligence</strong>. I am very passionate about technology and all
            of its interconnected facets, which drives me to learn about anything and everything.
          </p>
          <p className="opacity-80">Here are some of the technologies that I&apos;ve worked with:</p>
        </div>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        {skillCategories.map((category) => (
          <div key={category.title} className={`${CARD} p-5`}>
            <h2 className="mb-3 font-bold">{category.title}</h2>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-sm"
                >
                  <img src={skill.icon} alt="" className="size-4" loading="lazy" />
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <GlassWindow title="now.txt">
        <p className="mb-3 opacity-70">~ ❯ cat now.txt</p>
        <ul className="flex flex-col gap-2">
          <li>→ Rebuilding this site from scratch, one shader at a time</li>
          <li>→ Reading about color science and getting distracted by OKLab</li>
          <li>→ Learning to make pixel icons look good at any size</li>
          <li>→ Drinking too much café con leche</li>
        </ul>
      </GlassWindow>
    </div>
  )
}

export default About
