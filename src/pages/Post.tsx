import { lazy, Suspense, useEffect } from 'react'
import { blogPosts, formatPostDate } from '../data/blog'
import { LINK, MUTED, TAG } from '../surface'

// The markdown pipeline only loads once someone opens a post
const BlogArticle = lazy(() => import('../components/BlogArticle'))

function Post({ slug }: { slug: string }) {
  const post = blogPosts.find((candidate) => candidate.slug === decodeURIComponent(slug))

  useEffect(() => {
    document.title = post ? `${post.title} · Zaid Alsaheb` : 'Zaid Alsaheb'
    return () => {
      document.title = 'Zaid Alsaheb'
    }
  }, [post])

  const back = (
    <a href="#home" className={`inline-flex items-center gap-2 text-sm ${LINK}`}>
      <span aria-hidden="true">←</span> Back
    </a>
  )

  if (!post) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-6">
        {back}
        <p className="opacity-70">No such post.</p>
      </div>
    )
  }

  return (
    <article className="flex w-full max-w-3xl flex-col gap-8">
      {back}
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>
        <p className="flex flex-wrap items-center gap-3">
          <time dateTime={post.date} className={MUTED}>
            {formatPostDate(post.date)}
          </time>
          {post.draft && <span className={TAG}>draft</span>}
          {post.tags.map((tag) => (
            <span key={tag} className={TAG}>
              {tag}
            </span>
          ))}
        </p>
      </header>
      <Suspense fallback={<p className="opacity-70">Loading…</p>}>
        <BlogArticle body={post.body} />
      </Suspense>
    </article>
  )
}

export default Post
