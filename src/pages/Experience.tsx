import { ArrowRight } from 'pixelarticons/react/ArrowRight.js'
import { jobs } from '../data/jobs'
import { projectAnchor } from '../data/projects'
import { CARD, PAGE_TITLE, PIXEL_ICON, TAG } from '../surface'

function Experience() {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-10">
      <h1 className={PAGE_TITLE}>Experience</h1>

      <ol className="flex w-full flex-col gap-4">
        {jobs.toReversed().map((job) => (
          <li key={job.id} id={`job-${job.id}`} className={`${CARD} scroll-mt-24 p-6`}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h2 className="text-lg font-bold">{job.role}</h2>
              <p className="shrink-0 text-sm opacity-70">
                {job.startDate} – {job.endDate}
              </p>
            </div>
            <p className="opacity-80">@ {job.company}</p>

            <ul className="mt-4 flex list-['→_'] flex-col gap-2 pl-6 leading-relaxed">
              {job.content.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            {job.relatedProjects?.map((title) => (
              <a
                key={title}
                href={`#${projectAnchor(title)}`}
                className="mt-4 inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
              >
                Related project: {title}
                <ArrowRight {...PIXEL_ICON} />
              </a>
            ))}

            <ul className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <li key={skill} className={TAG}>
                  {skill}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Experience
