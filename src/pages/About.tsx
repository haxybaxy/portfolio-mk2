import GlassWindow from '../components/GlassWindow'

function About() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
      <h1 className="text-[clamp(3rem,10vw,8rem)] leading-none font-bold tracking-tighter">About</h1>
      <div className="flex flex-col gap-4 leading-relaxed opacity-90">
        <p>
          I build things for the web and spend too much time making the small details feel right. Most days that means
          React, TypeScript and the occasional shader I don't fully understand yet.
        </p>
        <p>
          Before this I bounced between design and engineering, which left me caring about how things look as much as
          how they work. These days I'm somewhere in the middle and happy there.
        </p>
        <p>
          Outside of work you'll find me walking around Madrid, collecting pixel fonts I'll never use, and starting side
          projects faster than I finish them.
        </p>
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
