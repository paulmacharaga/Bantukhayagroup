import { fetchTechnologyPageFromStrapi, fetchCompaniesFromStrapi } from '@/lib/strapi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default async function TechnologyPage() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const [techPage, companies] = await Promise.all([
    fetchTechnologyPageFromStrapi(baseUrl, token),
    fetchCompaniesFromStrapi(baseUrl, token),
  ])

  const heroTitle = techPage?.heroTitle || 'Technology Ecosystem'
  const heroDescription = techPage?.heroDescription || 'Explore the cutting-edge technologies and platforms that power Bantu Khaya Group\'s innovative solutions.'
  const body = techPage?.body || '<p>Our technology ecosystem is designed to scale with your organization\'s needs.</p>'
  const ctaTitle = techPage?.ctaTitle || 'Ready to Explore Our Technology?'
  const ctaDesc = techPage?.ctaDescription || 'Schedule a demonstration to see how our technology can transform your business.'
  const ctaButtonText = techPage?.ctaButtonText || 'Request a Demo'

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 py-12">
      {/* Hero Section */}
      <div className="space-y-6">
        {techPage?.heroImageUrl && (
          <div className="h-64 w-full overflow-hidden rounded-2xl border border-neutral-800">
            <img src={techPage.heroImageUrl} alt="Technology" className="h-full w-full object-cover" />
          </div>
        )}
        <h1 className="text-5xl font-semibold tracking-tight text-white">{heroTitle}</h1>
        <p className="max-w-3xl text-xl text-neutral-300 leading-relaxed">{heroDescription}</p>
      </div>

      {/* Body Content */}
      {techPage?.body && (
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      )}

      {/* Companies Section */}
      {companies.length > 0 && (
        <div className="space-y-8">
          <div className="border-l-4 border-brand-600 pl-6">
            <h2 className="text-3xl font-semibold text-white">Our Companies</h2>
            <p className="mt-2 text-neutral-400">
              The technology ecosystem is powered by our network of specialized companies.
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {companies.map((company: any) => (
              <div
                key={company.id}
                className="overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/60 transition-all hover:border-white/40"
              >
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-neutral-800"
                    >
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="h-6 w-6 object-contain" />
                      ) : (
                        <span className="text-white font-semibold" style={{ color: company.color || '#ffffff' }}>
                          {company.initial || company.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white">{company.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-300">{company.blurb}</p>
                      {company.description && (
                        <div className="mt-4 text-sm leading-6 text-neutral-300 prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.description}</ReactMarkdown>
                        </div>
                      )}
                      {company.link && (
                        <a
                          href={company.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block text-sm font-medium text-brand-400 hover:text-brand-300"
                        >
                          Visit Website →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-12 text-center">
        <h3 className="text-2xl font-semibold text-white">{ctaTitle}</h3>
        <p className="mt-4 text-neutral-400">{ctaDesc}</p>
        <a
          href="/contact"
          className="mt-6 inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {ctaButtonText}
        </a>
      </div>
    </section>
  )
}
