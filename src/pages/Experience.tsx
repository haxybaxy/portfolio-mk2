import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import TechChip from '../components/TechChip'
import { jobs } from '../data/jobs'
import { projectSlug } from '../data/projects'
import { skillCategories } from '../data/skills'
import { LINK, MUTED, SECTION_TITLE } from '../surface'

// Every role starts collapsed; the row shows dates, role and company. Only the latest few show until "See more".
const latestFirst = jobs.toReversed()
const INITIAL_ROLES = 4

function Experience() {
  const [showAll, setShowAll] = useState(false)
  const [focus, setFocus] = useState<string | null>(null)
  const visible = showAll ? latestFirst : latestFirst.slice(0, INITIAL_ROLES)

  // A #job-<id> link (e.g. from a project's "Built at") reveals the list if needed, then opens that role
  useEffect(() => {
    const readHash = () => {
      const match = /^#job-([\w-]+)$/.exec(window.location.hash)
      if (!match) return
      if (latestFirst.findIndex((job) => job.id === match[1]) >= INITIAL_ROLES) setShowAll(true)
      setFocus(match[1])
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  // Runs after the revealed rows exist in the DOM; each linked role is handled once
  const handled = useRef<string | null>(null)
  useEffect(() => {
    if (!focus || handled.current === focus) return
    const row = document.getElementById(`job-${focus}`)
    const details = row?.querySelector('details')
    if (!row || !details) return
    details.open = true
    row.scrollIntoView({ block: 'start' })
    handled.current = focus
  }, [focus, showAll])

  return (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <h2 className={SECTION_TITLE}>Experience</h2>

      <ol className="flex flex-col gap-6">
        {visible.map((job) => (
          <li key={job.id} id={`job-${job.id}`} className="scroll-mt-28">
            <details className="group">
              <summary className="grid cursor-pointer list-none gap-x-8 gap-y-1 sm:grid-cols-[10rem_1fr] [&::-webkit-details-marker]:hidden">
                {/* Inline on phones, two stacked lines beside the role on wider screens */}
                <span className={`${MUTED} sm:flex sm:flex-col`}>
                  <span>{job.startDate} –</span> <span>{job.endDate}</span>
                </span>
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-bold">
                    {job.role}
                    <span className="font-normal opacity-70"> · {job.company}</span>
                  </span>
                  <Icon
                    name="chevronDown"
                    className="size-4 shrink-0 self-center opacity-50 transition-transform duration-300 group-open:rotate-180"
                  />
                </span>
              </summary>

              <div className="mt-4 flex flex-col gap-4 sm:pl-[calc(10rem+2rem)]">
                <ul className="flex list-['→_'] flex-col gap-2 pl-6 text-sm leading-relaxed opacity-85">
                  {job.content.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {job.relatedProjects?.map((title) => (
                  <a key={title} href={`#project-${projectSlug(title)}`} className={`inline-flex items-center gap-2 text-sm ${LINK}`}>
                    {title}
                    <Icon name="arrowRight" />
                  </a>
                ))}
                <ul className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <TechChip key={skill} name={skill} />
                  ))}
                </ul>
              </div>
            </details>
          </li>
        ))}
      </ol>

      {latestFirst.length > INITIAL_ROLES && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          aria-expanded={showAll}
          className={`inline-flex cursor-pointer items-center gap-2 self-start text-sm ${LINK}`}
        >
          {showAll ? 'See less' : `See ${latestFirst.length - INITIAL_ROLES} more`}
          <Icon name="chevronDown" className={`size-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
        </button>
      )}

      <div className="flex flex-col gap-6 border-t border-fg/10 pt-10">
        {skillCategories.map((category) => (
          <div key={category.title} className="flex flex-col gap-3">
            <h3 className={MUTED}>{category.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <TechChip key={skill} name={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Experience
