import Link from 'next/link'
import { fetchBlogPostsFromStrapi } from '@/lib/strapi'

export default async function BlogPage() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const posts = await fetchBlogPostsFromStrapi(baseUrl, token)

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Marketing Blog</h1>
        <p className="text-lg text-neutral-300">
          Updates, launches, and stories from the Bantu Khaya Group.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 text-center text-sm text-neutral-400">
          No posts yet. Add your first blog post in Strapi to get started.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 transition hover:border-neutral-700"
            >
              {post.coverImageUrl && (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Marketing'}
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white group-hover:text-neutral-100">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-3 text-sm leading-6 text-neutral-300">{post.excerpt}</p>}
                <div className="mt-5 text-sm text-neutral-400">Read more →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
