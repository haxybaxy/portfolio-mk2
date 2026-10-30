import { ChevronDown } from 'pixelarticons/react/ChevronDown.js'
import { lazy, Suspense, useState } from 'react'
import { blogPosts, formatPostDate } from '../data/blog'
import { CARD, PAGE_TITLE, PIXEL_ICON, TAG } from '../surface'

// The markdown pipeline only loads once someone opens a post
const BlogArticle = lazy(() => import('../components/BlogArticle'))

function Blog() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-10">
      <h1 className={PAGE_TITLE}>Blog</h1>

      {blogPosts.length === 0 && <p className="opacity-70">Nothing published yet.</p>}

      <ul className="flex w-full flex-col gap-4">
        {blogPosts.map((post) => {
          const open = post.slug === openSlug
          return (
            <li key={post.slug} id={`post-${post.slug}`} className={`${CARD} scroll-mt-24`}>
              <button
                type="button"
                onClick={() => setOpenSlug(open ? null : post.slug)}
                aria-expanded={open}
                aria-controls={`post-body-${post.slug}`}
                className="flex w-full cursor-pointer flex-col gap-2 p-6 text-left"
              >
                <span className="flex items-center gap-3 text-sm opacity-70">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  {post.draft && <span className={TAG}>draft</span>}
                  <ChevronDown
                    {...PIXEL_ICON}
                    className={`ml-auto transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                  />
                </span>
                <span className="text-xl font-bold">{post.title}</span>
                <span className="leading-relaxed opacity-85">{post.description}</span>
                {post.tags.length > 0 && (
                  <span className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((tag) => (
                      <span key={tag} className={TAG}>
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </button>

              {open && (
                <div id={`post-body-${post.slug}`} className="border-t border-white/10 p-6">
                  <Suspense fallback={<p className="opacity-70">Loading…</p>}>
                    <BlogArticle body={post.body} />
                  </Suspense>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Blog
