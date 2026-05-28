import { fetchAboutPageFromStrapi } from '@/lib/strapi'

export default async function AboutPage() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const about = await fetchAboutPageFromStrapi(baseUrl, token)

  const ctaTitle = about?.ctaTitle || 'Ready to Work Together?'
  const ctaDesc = about?.ctaDescription || "Let's discuss how we can help you achieve your goals."
  const ctaButtonText = about?.ctaButtonText || 'Get in Touch'

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 py-12">
      {/* Hero Section */}
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          {about?.title && <h1 className="text-5xl font-semibold tracking-tight text-white">{about.title}</h1>}
          {about?.subtitle && <p className="text-xl text-neutral-300 leading-relaxed">{about.subtitle}</p>}
          {about?.body && (
            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: about.body }}
            />
          )}
        </div>
        {about?.heroImageUrl && (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <img src={about.heroImageUrl} alt={about?.title ?? 'About'} className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {/* Vision, Mission, Approach Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vision Card */}
        {about?.vision && (
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-brand-900/20 to-neutral-900/40 p-8">
            <div className="border-l-4 border-brand-600 pl-6">
              <h2 className="text-2xl font-semibold text-white">Our Vision</h2>
            </div>
            <div
              className="mt-6 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: about.vision }}
            />
          </div>
        )}

        {/* Mission Card */}
        {about?.mission && (
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-emerald-900/20 to-neutral-900/40 p-8">
            <div className="border-l-4 border-emerald-600 pl-6">
              <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            </div>
            <div
              className="mt-6 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: about.mission }}
            />
          </div>
        )}

        {/* Approach Card */}
        {about?.approach && (
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-purple-900/20 to-neutral-900/40 p-8">
            <div className="border-l-4 border-purple-600 pl-6">
              <h2 className="text-2xl font-semibold text-white">Our Approach</h2>
            </div>
            <div
              className="mt-6 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: about.approach }}
            />
          </div>
        )}
      </div>

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
