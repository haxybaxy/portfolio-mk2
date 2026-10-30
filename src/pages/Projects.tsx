import { startTransition, useEffect, useState, ViewTransition, type TransitionEvent } from 'react'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import TechChip from '../components/TechChip'
import { jobs } from '../data/jobs'
import { categoryOrder, projectSlug, projects, type Project } from '../data/projects'
import { reducedMotion } from '../motion'
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
const CHIP_BUTTON =
  'relative cursor-pointer rounded-full border px-3 py-1 text-sm transition-[color,border-color,opacity,scale] duration-300 active:scale-[0.98]'

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

// Desktop preview layers kept while their fades overlap: enough for a pointer sweeping the list every ~40ms
const PREVIEW_LAYERS = 6
type Layer = { id: number; project: Project }

function Projects() {
  const [filter, setFilter] = useState<Filter>('Featured')
  const [selected, setSelected] = useState<Project>(projects[0])
  // Desktop: hovering a row previews it without changing the selection
  const [peek, setPeek] = useState<Project | null>(null)
  // Phones: the row that was open keeps its content while it folds up
  const [closing, setClosing] = useState<Project | null>(null)

  // Following a #project-<slug> link (from Experience) selects that project, widening the filter if needed.
  // Deliberately plain state updates (no view transition) so the row is measured on a settled layout.
  const [target, setTarget] = useState<{ slug: string; instant: boolean } | null>(null)
  useEffect(() => {
    const selectFromHash = (initial: boolean) => {
      const match = /^#project-([\w-]+)$/.exec(window.location.hash)
      const project = match && projects.find((candidate) => projectSlug(candidate.title) === match[1])
      if (!project) return
      setSelected(project)
      setFilter((current) => (matches(project, current) ? current : 'All'))
      // A link opened in a fresh tab jumps straight there; one followed within the page glides
      setTarget({ slug: match[1], instant: initial })
    }
    selectFromHash(true)
    const onHashChange = () => selectFromHash(false)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Runs after the render that widened the list, so the row exists when it is measured
  useEffect(() => {
    if (!target) return
    document
      .getElementById(`project-${target.slug}`)
      ?.scrollIntoView({ block: 'start', behavior: target.instant ? 'instant' : 'auto' })
  }, [target])

  const visible = projects.filter((project) => matches(project, filter))
  const current = visible.includes(selected) ? selected : visible[0]
  const previewed = peek ?? current

  // Desktop preview: each change stacks a new layer that fades in over the still-opaque last one, so a pointer sweeping
  // the list only retargets fades. Once the top layer is opaque (its transitionend) the ones beneath are dropped.
  const [layers, setLayers] = useState<Layer[]>(() => [{ id: 0, project: previewed }])
  const top = layers[layers.length - 1]
  if (top.project !== previewed) setLayers([...layers.slice(1 - PREVIEW_LAYERS), { id: top.id + 1, project: previewed }])
  const settle = (event: TransitionEvent<HTMLDivElement>) => {
    // Links inside the layer have their own transitions; only the layer's fade counts
    if (event.target === event.currentTarget && event.propertyName === 'opacity') setLayers((stack) => stack.slice(-1))
  }

  const changeFilter = (option: Filter) => {
    if (option === filter) return
    setClosing(null)
    // Inside a Transition the <ViewTransition>s below glide the rows and the chip fill between layouts
    if (reducedMotion()) setFilter(option)
    else startTransition(() => setFilter(option))
  }
  const select = (project: Project) => {
    if (project === current) return
    setClosing(current)
    setSelected(project)
  }
  // Fetch the listed photos as the pointer reaches the list so a row's first hover does not wait on the network
  const warmPhotos = () => {
    for (const project of visible) new Image().src = project.imageUrl
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-10">
      <Reveal>
        <h2 className={SECTION_TITLE}>Projects</h2>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
        <div className="flex flex-col gap-6">
          <ul className="flex flex-wrap gap-2" aria-label="Filter projects">
            {FILTERS.map((option) => {
              const isActive = option === filter
              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => changeFilter(option)}
                    aria-pressed={isActive}
                    className={`${CHIP_BUTTON} ${isActive ? 'border-fg text-bg' : 'border-fg/20 opacity-70 hover:opacity-100'}`}
                  >
                    {/* The fill lives only in the active chip, so it glides over when another is chosen */}
                    {isActive && (
                      <ViewTransition name="project-filter" default="projects-pill">
                        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-fg" />
                      </ViewTransition>
                    )}
                    <span className="relative">{option}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <ul
            className="flex flex-col"
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') warmPhotos()
            }}
            onPointerLeave={() => setPeek(null)}
          >
            {visible.map((project) => {
              const isSelected = project === current
              const slug = projectSlug(project.title)
              return (
                <ViewTransition key={project.title} name={`project-${slug}`} default="projects-row">
                  <li id={`project-${slug}`} className="scroll-mt-28 border-b border-fg/10 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => select(project)}
                      // A tap is not a hover: on phones it would only stack hidden preview layers
                      onPointerEnter={(event) => {
                        if (event.pointerType !== 'touch') setPeek(project)
                      }}
                      aria-pressed={isSelected}
                      className={`flex w-full cursor-pointer items-baseline justify-between gap-4 py-2.5 text-left transition-opacity duration-200 ${isSelected ? '' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <span className={isSelected ? 'font-bold' : ''}>{project.title}</span>
                      <span className={`${MUTED} shrink-0 text-right`}>{project.category}</span>
                    </button>
                    {/* Phones have no preview pane: the selected row unfolds in place while the previous one folds up */}
                    <div
                      inert={!isSelected}
                      onTransitionEnd={
                        project === closing
                          ? (event) => {
                              if (event.target === event.currentTarget) setClosing(null)
                            }
                          : undefined
                      }
                      className={`grid transition-[grid-template-rows] duration-300 md:hidden ${isSelected ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="overflow-hidden">
                        {(isSelected || project === closing) && (
                          <div className="pt-2 pb-6">
                            <ProjectDetail project={project} />
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                </ViewTransition>
              )
            })}
          </ul>
        </div>

        <aside className="sticky top-28 hidden self-start md:block">
          <div className="grid">
            {layers.map((layer, index) => {
              const isTop = index === layers.length - 1
              return (
                <div
                  key={layer.id}
                  inert={!isTop}
                  onTransitionEnd={isTop ? settle : undefined}
                  className="[grid-area:1/1] transition-opacity duration-200 starting:opacity-0"
                >
                  <ProjectDetail project={layer.project} />
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Projects
