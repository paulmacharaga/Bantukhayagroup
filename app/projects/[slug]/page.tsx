import Link from 'next/link'
import { fetchProjectBySlugFromStrapi, fetchProjectsFromStrapi } from '@/lib/strapi'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) return []
  const token = process.env.STRAPI_API_TOKEN
  const projects = await fetchProjectsFromStrapi(baseUrl, token)
  return projects.map((project: any) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const project = await fetchProjectBySlugFromStrapi(baseUrl, params.slug, token)

  if (!project) {
    notFound()
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 transition hover:text-white"
      >
        ← Back to Projects
      </Link>

      <div className="space-y-6">
        {project.coverImageUrl && (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
            {project.client && <span>{project.client}</span>}
            {project.year && <span>• {project.year}</span>}
            {project.industry && <span>• {project.industry}</span>}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">{project.title}</h1>
          {project.excerpt && <p className="text-lg text-neutral-300">{project.excerpt}</p>}
        </div>

        {project.services && project.services.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.services.map((service: string, idx: number) => (
              <span
                key={idx}
                className="rounded-full border border-neutral-700 bg-neutral-800/50 px-3 py-1 text-xs text-neutral-300"
              >
                {service}
              </span>
            ))}
          </div>
        )}

        {project.description && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Overview</h2>
            <div className="space-y-4 text-sm leading-7 text-neutral-300 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
            </div>
          </div>
        )}

        {project.challenges && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Challenges</h2>
            <div className="space-y-4 text-sm leading-7 text-neutral-300 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.challenges}</ReactMarkdown>
            </div>
          </div>
        )}

        {project.outcome && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Outcome</h2>
            <div className="space-y-4 text-sm leading-7 text-neutral-300 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.outcome}</ReactMarkdown>
            </div>
          </div>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Gallery</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {project.gallery.map((image: string, idx: number) => (
                <div key={idx} className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
                  <img src={image} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
