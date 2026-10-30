import { ChevronDown } from 'pixelarticons/react/ChevronDown.js'
import { lazy, Suspense, useState, type ReactNode } from 'react'
import CopyEmail from '../components/CopyEmail'
import Koi from '../components/Koi'
import { GITHUB_URL, LINKEDIN_URL } from '../contact'
import { blogPosts, formatPostDate, type BlogPost } from '../data/blog'
import { jobs } from '../data/jobs'
import { categoryOrder, projects } from '../data/projects'
import { skillCategories } from '../data/skills'
import { REVEAL } from '../motion'
import { PIXEL_ICON } from '../surface'

// The markdown pipeline only loads once someone opens a post
const BlogArticle = lazy(() => import('../components/BlogArticle'))

const LINK = 'underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white'
const HEADING = 'text-xs font-bold tracking-[0.2em] uppercase opacity-60'
// Two-column rows: a fixed left gutter for dates/labels, content on the right
const ROW = 'grid gap-x-6 gap-y-1 sm:grid-cols-[10rem_1fr]'
const MUTED = 'text-sm opacity-60'

const sectionIds = ['about', 'experience', 'projects', 'writing'] as const

// Listed categories first in their set order, then any others in the order they appear
const categories = [...new Set([...categoryOrder, ...projects.map((project) => project.category)])]
const projectGroups = categories
  .map((category) => [category, projects.filter((project) => project.category === category)] as const)
  .filter(([, items]) => items.length > 0)

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-16 flex-col gap-5">
      <h2 className={HEADING}>{title}</h2>
      {children}
    </section>
  )
}

/** Disclosure row: `summary` is always visible, children appear when opened */
function Disclosure({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="group">
      <summary className={`${ROW} cursor-pointer list-none items-baseline [&::-webkit-details-marker]:hidden`}>
        {summary}
        <ChevronDown
          {...PIXEL_ICON}
          className="col-start-2 row-start-1 ml-auto self-center opacity-50 transition-transform duration-300 group-open:rotate-180 sm:col-start-3"
        />
      </summary>
      <div className="mt-3 flex flex-col gap-3 sm:pl-[calc(10rem+1.5rem)]">{children}</div>
    </details>
  )
}

function Post({ post }: { post: BlogPost }) {
  const [open, setOpen] = useState(false)

  return (
    <details className="group" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className={`${ROW} cursor-pointer list-none items-baseline [&::-webkit-details-marker]:hidden`}>
        <time dateTime={post.date} className={MUTED}>
          {formatPostDate(post.date)}
        </time>
        <span className="flex flex-col gap-1">
          <span className={LINK}>{post.title}</span>
          <span className="text-sm opacity-80">{post.description}</span>
        </span>
      </summary>
      {open && (
        <div className="mt-4 border-l border-white/15 pl-5 sm:ml-[calc(10rem+1.5rem)]">
          <Suspense fallback={<p className="opacity-70">Loading…</p>}>
            <BlogArticle body={post.body} />
          </Suspense>
        </div>
      )}
    </details>
  )
}

function Profile() {
  return (
    <main className={`mx-auto flex w-full max-w-2xl flex-col gap-16 px-6 py-16 md:py-24 ${REVEAL}`}>
      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Zaid Alsaheb</h1>
            <p className="opacity-80">Computer Science &amp; AI undergrad at IE University. Madrid, Spain.</p>
          </div>
          <nav aria-label="Sections" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {sectionIds.map((id) => (
              <a key={id} href={`#${id}`} className={LINK}>
                {id}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <CopyEmail />
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={LINK}>
              GitHub
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className={LINK}>
              LinkedIn
            </a>
          </div>
        </div>
        <Koi className="shrink-0 [--koi-h:9rem] sm:[--koi-h:12rem]" />
      </header>

      <Section id="about" title="About">
        <p className="leading-relaxed">
          I am currently an undergrad student at IE University, pursuing a bachelors degree in Computer Science and
          Artificial Intelligence. I am very passionate about technology and all of its interconnected facets, which
          drives me to learn about anything and everything.
        </p>
        <div className={ROW}>
          <span className={MUTED}>now</span>
          <ul className="flex flex-col gap-1">
            <li>Rebuilding this site from scratch</li>
            <li>Reading about color science and getting distracted by OKLab</li>
            <li>Learning to make pixel icons look good at any size</li>
            <li>Drinking too much café con leche</li>
          </ul>
        </div>
        <dl className={`${ROW} sm:gap-y-2`}>
          {skillCategories.map((category) => (
            <div key={category.title} className="contents">
              <dt className={MUTED}>{category.title}</dt>
              <dd className="opacity-90">{category.skills.map((skill) => skill.name).join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="experience" title="Experience">
        <ol className="flex flex-col gap-5">
          {jobs.toReversed().map((job) => (
            <li key={job.id} id={`job-${job.id}`} className="scroll-mt-16">
              <Disclosure
                summary={
                  <>
                    <span className={MUTED}>
                      {job.startDate} – {job.endDate}
                    </span>
                    <span>
                      {job.role}
                      <span className="opacity-70"> · {job.company}</span>
                    </span>
                  </>
                }
              >
                <ul className="flex list-['→_'] flex-col gap-2 pl-6 text-sm leading-relaxed opacity-90">
                  {job.content.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className={MUTED}>{job.skills.join(', ')}</p>
              </Disclosure>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="projects" title="Projects">
        <div className="flex flex-col gap-6">
          {projectGroups.map(([category, items]) => (
            <div key={category} className={ROW}>
              <h3 className={MUTED}>{category}</h3>
              <ul className="flex flex-col gap-3">
                {items.map((project) => {
                  const primary = project.link ?? project.github
                  return (
                    <li key={project.title} className="leading-relaxed">
                      {primary ? (
                        <a href={primary} target="_blank" rel="noreferrer" className={LINK}>
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                      <span className="opacity-80"> — {project.description}</span>
                      {project.link && project.github && (
                        <>
                          {' '}
                          <a href={project.github} target="_blank" rel="noreferrer" className={`${MUTED} ${LINK}`}>
                            source
                          </a>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="writing" title="Writing">
        {blogPosts.length === 0 && <p className="opacity-70">Nothing published yet.</p>}
        <ul className="flex flex-col gap-5">
          {blogPosts.map((post) => (
            <li key={post.slug} id={`post-${post.slug}`} className="scroll-mt-16">
              <Post post={post} />
            </li>
          ))}
        </ul>
      </Section>
    </main>
  )
}

export default Profile
