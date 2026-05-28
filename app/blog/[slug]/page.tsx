import { notFound } from 'next/navigation'
import { fetchBlogPostBySlugFromStrapi } from '@/lib/strapi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const post = await fetchBlogPostBySlugFromStrapi(baseUrl, params.slug, token)

  if (!post) {
    notFound()
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Blog</div>
        <h1 className="text-4xl font-semibold tracking-tight text-white">{post.title}</h1>
        {post.excerpt && <p className="text-lg text-neutral-300">{post.excerpt}</p>}
      </div>

      {post.coverImageUrl && (
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      {post.body ? (
        <div className="space-y-4 text-sm leading-7 text-neutral-300 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
          Add blog content in Strapi to show the full article here.
        </div>
      )}
    </section>
  )
}
