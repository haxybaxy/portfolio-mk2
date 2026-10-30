import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import TechChip from '../components/TechChip'
import { jobs } from '../data/jobs'
import { categoryOrder, projectSlug, projects, type Project } from '../data/projects'
import { LINK, MUTED, PANEL, SECTION_TITLE } from '../surface'

// Listed categories first in their set order, then any others in the order they appear
const categories = [...new Set([...categoryOrder, ...projects.map((project) => project.category)])]
const FILTERS = ['Featured', 'All', ...categories] as const
type Filter = (typeof FILTERS)[number]

function matches(project: Project, filter: Filter) {
  if (filter === 'All') return true
  if (filter === 'Featured') return project.featured === true
  return project.category === filter
}

const ICON_LINK = 'opacity-70 transition-opacity hover:opacity-100'

/** Photo, links, description, where it was built and the stack for one project */
function ProjectDetail({ project }: { project: Project }) {
  const builtAt = jobs.filter((job) => job.relatedProjects?.includes(project.title))

  return (
    <div className="flex flex-col gap-4">
      <img src={project.imageUrl} alt="" className={`${PANEL} aspect-video w-full object-cover`} loading="lazy" />
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold">{project.title}</h3>
        <div className="flex shrink-0 gap-3">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`} className={ICON_LINK}>
              <Icon name="github" className="size-[1.125rem]" />
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`} className={ICON_LINK}>
              <Icon name="externalLink" className="size-[1.125rem]" />
            </a>
          )}
        </div>
      </div>
      <p className="text-sm leading-relaxed opacity-80">{project.description}</p>
      {builtAt.map((job) => (
        <a key={job.id} href={`#job-${job.id}`} className={`inline-flex items-center gap-2 text-sm ${LINK}`}>
          <Icon name="briefcase" />
          Built at {job.company}
        </a>
      ))}
      <ul className="flex flex-wrap gap-2">
        {project.tech.map((name) => (
          <TechChip key={name} name={name} />
        ))}
      </ul>
    </div>
  )
}

function Projects() {
  const [filter, setFilter] = useState<Filter>('Featured')
  const [selected, setSelected] = useState<Project>(projects[0])
  // Desktop: hovering a row previews it without changing the selection
  const [peek, setPeek] = useState<Project | null>(null)

  // Following a #project-<slug> link (from Experience) selects that project, widening the filter if needed
  useEffect(() => {
    const selectFromHash = () => {
      const match = /^#project-([\w-]+)$/.exec(window.location.hash)
      const project = match && projects.find((candidate) => projectSlug(candidate.title) === match[1])
      if (!project) return
      setSelected(project)
      setFilter((current) => (matches(project, current) ? current : 'All'))
      // The list may grow when the filter widens, so align the row after React has rendered
      requestAnimationFrame(() => document.getElementById(`project-${match[1]}`)?.scrollIntoView({ block: 'start' }))
    }
    selectFromHash()
    window.addEventListener('hashchange', selectFromHash)
    return () => window.removeEventListener('hashchange', selectFromHash)
  }, [])

  const visible = projects.filter((project) => matches(project, filter))
  const current = visible.includes(selected) ? selected : visible[0]
  const previewed = peek ?? current

  return (
    <div className="flex w-full max-w-6xl flex-col gap-10">
      <h2 className={SECTION_TITLE}>Projects</h2>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
        <div className="flex flex-col gap-6">
          <ul className="flex flex-wrap gap-2" aria-label="Filter projects">
            {FILTERS.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={option === filter}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors ${
                    option === filter ? 'border-fg bg-fg text-bg' : 'border-fg/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col" onPointerLeave={() => setPeek(null)}>
            {visible.map((project) => {
              const isSelected = project === current
              return (
                <li key={project.title} id={`project-${projectSlug(project.title)}`} className="scroll-mt-28 border-b border-fg/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    onPointerEnter={() => setPeek(project)}
                    aria-pressed={isSelected}
                    className={`flex w-full cursor-pointer items-baseline justify-between gap-4 py-2.5 text-left ${isSelected ? '' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <span className={isSelected ? 'font-bold' : ''}>{project.title}</span>
                    <span className={`${MUTED} shrink-0 text-right`}>{project.category}</span>
                  </button>
                  {/* Phones have no preview pane: the selected row expands in place */}
                  {isSelected && (
                    <div className="pt-2 pb-6 md:hidden">
                      <ProjectDetail project={project} />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {previewed && (
          <aside className="sticky top-28 hidden self-start md:block">
            <ProjectDetail project={previewed} />
          </aside>
        )}
      </div>
    </div>
  )
}

export default Projects
