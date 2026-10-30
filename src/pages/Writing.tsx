import { lazy, Suspense, useState } from 'react'
import Icon from '../components/Icon'
import { blogPosts, formatPostDate, type BlogPost } from '../data/blog'
import { LINK, MUTED, SECTION_TITLE, TAG } from '../surface'

// The markdown pipeline only loads once someone opens a post
const BlogArticle = lazy(() => import('../components/BlogArticle'))

function Post({ post }: { post: BlogPost }) {
  const [open, setOpen] = useState(false)

  return (
    <details className="group" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="grid cursor-pointer list-none gap-x-8 gap-y-2 sm:grid-cols-[10rem_1fr] [&::-webkit-details-marker]:hidden">
        <time dateTime={post.date} className={MUTED}>
          {formatPostDate(post.date)}
        </time>
        <span className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between gap-4">
            <span className={`text-lg font-bold ${LINK}`}>{post.title}</span>
            <Icon
              name="chevronDown"
              className="size-4 shrink-0 self-center opacity-50 transition-transform duration-300 group-open:rotate-180"
            />
          </span>
          <span className="leading-relaxed opacity-80">{post.description}</span>
          {post.tags.length > 0 && (
            <span className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((tag) => (
                <span key={tag} className={TAG}>
                  {tag}
                </span>
              ))}
            </span>
          )}
        </span>
      </summary>
      {open && (
        <div className="mt-6 border-l border-fg/15 pl-5 sm:ml-[calc(10rem+2rem)]">
          <Suspense fallback={<p className="opacity-70">Loading…</p>}>
            <BlogArticle body={post.body} />
          </Suspense>
        </div>
      )}
    </details>
  )
}

function Writing() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <h2 className={SECTION_TITLE}>Writing</h2>

      {blogPosts.length === 0 && <p className="opacity-70">Nothing published yet.</p>}

      <ul className="flex flex-col gap-10">
        {blogPosts.map((post) => (
          <li key={post.slug} id={`post-${post.slug}`} className="scroll-mt-28">
            <Post post={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Writing
