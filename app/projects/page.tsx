import Link from 'next/link'
import { fetchProjectsFromStrapi } from '@/lib/strapi'

export default async function ProjectsPage() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const projects = await fetchProjectsFromStrapi(baseUrl, token)

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 py-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-white">Projects & Case Studies</h1>
        <p className="text-xl text-neutral-300 max-w-2xl">
          Discover how we've helped organizations transform their businesses through innovative solutions and strategic partnerships.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-16 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-neutral-400">Add your first project in Strapi to get started.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 transition-all duration-300 hover:border-brand-600/50 hover:shadow-2xl hover:shadow-brand-600/10"
            >
              {project.coverImageUrl && (
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent" />
                  {project.client && (
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-block rounded-full bg-brand-600/20 px-3 py-1 text-xs font-medium text-brand-300 border border-brand-600/30 backdrop-blur-sm">
                        {project.client}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                  {project.year && <span>{project.year}</span>}
                  {project.industry && <span>• {project.industry}</span>}
                </div>
                <h2 className="text-xl font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-2">
                  {project.title}
                </h2>
                {project.excerpt && (
                  <p className="mt-3 text-sm leading-6 text-neutral-400 line-clamp-3 flex-1">{project.excerpt}</p>
                )}
                <div className="mt-4 flex items-center text-sm font-medium text-brand-400 group-hover:text-brand-300 transition-colors">
                  View case study
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
