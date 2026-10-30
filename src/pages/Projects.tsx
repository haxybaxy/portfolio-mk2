import { Briefcase } from 'pixelarticons/react/Briefcase.js'
import { ExternalLink } from 'pixelarticons/react/ExternalLink.js'
import { Github } from 'pixelarticons/react/Github.js'
import { jobs } from '../data/jobs'
import { categoryOrder, projectAnchor, projects, type Project } from '../data/projects'
import { CARD, PAGE_TITLE, PIXEL_ICON } from '../surface'

// Listed categories first in their set order, then any others in the order they appear
const categories = [...new Set([...categoryOrder, ...projects.map((project) => project.category)])]
const groups = categories
  .map((category) => [category, projects.filter((project) => project.category === category)] as const)
  .filter(([, items]) => items.length > 0)

const LINK_CLASS = 'opacity-70 transition-opacity hover:opacity-100'

function ProjectCard({ project }: { project: Project }) {
  const builtAt = jobs.filter((job) => job.relatedProjects?.includes(project.title))

  return (
    <article id={projectAnchor(project.title)} className={`${CARD} flex scroll-mt-24 flex-col overflow-hidden`}>
      <img src={project.imageUrl} alt="" className="aspect-video w-full object-cover" loading="lazy" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold">{project.title}</h3>
          <div className="flex shrink-0 gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`} className={LINK_CLASS}>
                <Github {...PIXEL_ICON} />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`} className={LINK_CLASS}>
                <ExternalLink {...PIXEL_ICON} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed opacity-85">{project.description}</p>

        {builtAt.map((job) => (
          <a key={job.id} href={`#job-${job.id}`} className={`inline-flex items-center gap-2 text-sm ${LINK_CLASS}`}>
            <Briefcase {...PIXEL_ICON} />
            Built at: {job.company}
          </a>
        ))}

        <ul className="mt-auto flex flex-wrap gap-3 pt-2">
          {Object.entries(project.icons).map(([name, icon]) => (
            <li key={name}>
              <img src={icon} alt={name} title={name} className="size-5" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function Projects() {
  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-10">
      <h1 className={PAGE_TITLE}>Projects</h1>

      {groups.map(([category, items]) => (
        <section key={category} className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-bold">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Projects
