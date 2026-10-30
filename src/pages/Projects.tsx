import { Briefcase } from 'pixelarticons/react/Briefcase.js'
import { ExternalLink } from 'pixelarticons/react/ExternalLink.js'
import { Github } from 'pixelarticons/react/Github.js'
import TechChip from '../components/TechChip'
import { jobs } from '../data/jobs'
import { categoryOrder, projectAnchor, projects, type Project } from '../data/projects'
import { LINK, MUTED, PANEL, PIXEL_ICON, SECTION_TITLE } from '../surface'

// Listed categories first in their set order, then any others in the order they appear
const categories = [...new Set([...categoryOrder, ...projects.map((project) => project.category)])]
const groups = categories
  .map((category) => [category, projects.filter((project) => project.category === category)] as const)
  .filter(([, items]) => items.length > 0)

const ICON_LINK = 'opacity-70 transition-opacity hover:opacity-100'

function ProjectCard({ project }: { project: Project }) {
  const builtAt = jobs.filter((job) => job.relatedProjects?.includes(project.title))

  return (
    <article id={projectAnchor(project.title)} className={`${PANEL} flex scroll-mt-24 flex-col`}>
      <img src={project.imageUrl} alt="" className="aspect-video w-full object-cover" loading="lazy" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-bold">{project.title}</h4>
          <div className="flex shrink-0 gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`} className={ICON_LINK}>
                <Github {...PIXEL_ICON} />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`} className={ICON_LINK}>
                <ExternalLink {...PIXEL_ICON} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed opacity-80">{project.description}</p>

        {builtAt.map((job) => (
          <a key={job.id} href={`#job-${job.id}`} className={`inline-flex items-center gap-2 text-sm ${LINK}`}>
            <Briefcase {...PIXEL_ICON} />
            Built at {job.company}
          </a>
        ))}

        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.tech.map((name) => (
            <TechChip key={name} name={name} />
          ))}
        </ul>
      </div>
    </article>
  )
}

function Projects() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-12">
      <h2 className={SECTION_TITLE}>Projects</h2>

      {groups.map(([category, items]) => (
        <section key={category} className="flex flex-col gap-5">
          <h3 className={MUTED}>{category}</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
