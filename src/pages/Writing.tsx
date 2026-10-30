import { blogPosts, formatPostDate } from '../data/blog'
import { href } from '../router'
import type { PageProps } from '../routes'
import { LINK, MUTED, SECTION_TITLE, TAG } from '../surface'
import Post from './Post'

function Writing({ params }: PageProps) {
  if (params[0]) return <Post slug={params[0]} />

  return (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <h2 className={SECTION_TITLE}>Writing</h2>

      {blogPosts.length === 0 && <p className="opacity-70">Nothing published yet.</p>}

      <ul className="flex flex-col gap-8">
        {blogPosts.map((post) => (
          <li key={post.slug} className="grid gap-x-8 gap-y-2 sm:grid-cols-[10rem_1fr]">
            <time dateTime={post.date} className={MUTED}>
              {formatPostDate(post.date)}
            </time>
            <div className="flex flex-col gap-2">
              <a href={href('writing', post.slug)} className={`text-lg font-bold ${LINK}`}>
                {post.title}
              </a>
              <p className="leading-relaxed opacity-80">{post.description}</p>
              {post.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {post.tags.map((tag) => (
                    <li key={tag} className={TAG}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Writing
