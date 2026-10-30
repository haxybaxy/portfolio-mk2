import Markdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

// Module scope so the plugin lists and component map aren't rebuilt each render
const remarkPlugins = [remarkGfm]
const rehypePlugins = [rehypeSlug, rehypeHighlight]

const components: Components = {
  // Only pass what a markdown link carries, so react-markdown's `node` never reaches the DOM
  a({ href, title, children }) {
    const external = !!href && /^https?:\/\//.test(href)
    return (
      <a href={href} title={title} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {children}
      </a>
    )
  },
}

function BlogArticle({ body }: { body: string }) {
  return (
    <div className="blog-prose">
      <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
        {body}
      </Markdown>
    </div>
  )
}

export default BlogArticle
