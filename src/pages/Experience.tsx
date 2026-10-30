import { ArrowRight } from 'pixelarticons/react/ArrowRight.js'
import TechChip from '../components/TechChip'
import { jobs } from '../data/jobs'
import { projectAnchor } from '../data/projects'
import { LINK, MUTED, PIXEL_ICON, SECTION_TITLE } from '../surface'

function Experience() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-12">
      <h2 className={SECTION_TITLE}>Experience</h2>

      <ol className="flex flex-col gap-12">
        {jobs.toReversed().map((job) => (
          <li key={job.id} id={`job-${job.id}`} className="grid scroll-mt-24 gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
            {/* Inline on phones, two stacked lines beside the role on wider screens */}
            <p className={`${MUTED} sm:flex sm:flex-col`}>
              <span>{job.startDate} –</span> <span>{job.endDate}</span>
            </p>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold">
                {job.role}
                <span className="font-normal opacity-70"> · {job.company}</span>
              </h3>
              <ul className="flex list-['→_'] flex-col gap-2 pl-6 text-sm leading-relaxed opacity-85">
                {job.content.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {job.relatedProjects?.map((title) => (
                <a key={title} href={`#${projectAnchor(title)}`} className={`inline-flex items-center gap-2 text-sm ${LINK}`}>
                  {title}
                  <ArrowRight {...PIXEL_ICON} />
                </a>
              ))}
              <ul className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <TechChip key={skill} name={skill} />
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Experience
