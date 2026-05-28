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
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Projects & Case Studies</h1>
        <p className="text-lg text-neutral-300">
          Explore our portfolio of successful projects and case studies across the Bantu Khaya Group.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 text-center text-sm text-neutral-400">
          No projects yet. Add your first project in Strapi to get started.
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 transition hover:border-neutral-700"
            >
              {project.coverImageUrl && (
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {project.client && <span>{project.client}</span>}
                  {project.year && <span>• {project.year}</span>}
                  {project.industry && <span>• {project.industry}</span>}
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white group-hover:text-neutral-100">
                  {project.title}
                </h2>
                {project.excerpt && <p className="mt-3 text-sm leading-6 text-neutral-300">{project.excerpt}</p>}
                <div className="mt-5 text-sm text-neutral-400">View case study →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
