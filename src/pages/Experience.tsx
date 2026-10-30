import { useEffect } from 'react'
import Icon from '../components/Icon'
import TechChip from '../components/TechChip'
import { jobs } from '../data/jobs'
import { projectSlug } from '../data/projects'
import { href } from '../router'
import type { PageProps } from '../routes'
import { LINK, MUTED, SECTION_TITLE } from '../surface'

// Latest roles open by default; older ones are one click away
const OPEN_BY_DEFAULT = 3
const latestFirst = jobs.toReversed()

function Experience({ params }: PageProps) {
  const focus = params[0]

  // #/experience/<job id> opens that role and brings it into view (after App has reset the scroll)
  useEffect(() => {
    if (!focus) return
    const frame = requestAnimationFrame(() => document.getElementById(`job-${focus}`)?.scrollIntoView({ block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [focus])

  return (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <h2 className={SECTION_TITLE}>Experience</h2>

      <ol className="flex flex-col gap-6">
        {latestFirst.map((job, i) => (
          <li key={job.id} id={`job-${job.id}`} className="scroll-mt-28">
            <details open={i < OPEN_BY_DEFAULT || job.id === focus} className="group">
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
                  <a key={title} href={href('projects', projectSlug(title))} className={`inline-flex items-center gap-2 text-sm ${LINK}`}>
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
    </div>
  )
}

export default Experience
