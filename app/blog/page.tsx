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
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 py-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-white">Insights & News</h1>
        <p className="text-xl text-neutral-300 max-w-2xl">
          Explore our latest thoughts, industry insights, and stories from across the Bantu Khaya ecosystem.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-16 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
          <p className="text-neutral-400">Add your first blog post in Strapi to get started.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 transition-all duration-300 hover:border-brand-600/50 hover:shadow-2xl hover:shadow-brand-600/10"
            >
              {post.coverImageUrl && (
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent opacity-60" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3">
                  <span className="inline-block rounded-full bg-brand-600/10 px-3 py-1 text-xs font-medium text-brand-400 border border-brand-600/20">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Blog'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-3 text-sm leading-6 text-neutral-400 line-clamp-3 flex-1">{post.excerpt}</p>
                )}
                <div className="mt-4 flex items-center text-sm font-medium text-brand-400 group-hover:text-brand-300 transition-colors">
                  Read article
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
