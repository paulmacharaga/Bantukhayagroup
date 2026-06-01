import { fetchAboutPageFromStrapi } from '@/lib/strapi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-20 py-16">
      {/* Hero Section */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          {about?.title && (
            <h1 className="text-6xl font-bold tracking-tight text-white leading-tight">
              {about.title}
            </h1>
          )}
          {about?.subtitle && (
            <p className="text-2xl text-neutral-300 leading-relaxed max-w-xl">
              {about.subtitle}
            </p>
          )}
          {about?.body && (
            <div className="prose prose-invert prose-xl max-w-none prose-p:text-neutral-300 prose-p:leading-8 prose-p:mb-6 prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-li:my-3 prose-li:text-neutral-300 prose-li:leading-7 prose-li:pl-2 prose-strong:text-white prose-headings:text-white prose-hr:border-neutral-700 prose-h4:text-white prose-h4:font-semibold prose-h4:mt-8 prose-h4:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:my-3 [&_li]:pl-2 [&_li]:text-neutral-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.body}</ReactMarkdown>
            </div>
          )}
        </div>
        {about?.heroImageUrl && (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl blur-2xl opacity-20" />
            <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 shadow-2xl">
              <img
                src={about.heroImageUrl}
                alt={about?.title ?? 'About'}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Vision, Mission, Approach Cards */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Vision Card */}
        {about?.vision && (
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-brand-900/30 to-neutral-900/40 p-8 transition-all duration-300 hover:border-brand-600/50 hover:shadow-2xl hover:shadow-brand-600/10">
            <div className="absolute top-0 right-0 h-32 w-32 bg-brand-600/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <div className="prose prose-invert prose-sm max-w-none prose-p:text-neutral-300 prose-p:leading-7 prose-p:mb-4 prose-ul:my-3 prose-ul:ml-4 prose-ul:list-disc prose-li:my-2 prose-li:text-neutral-300 prose-li:leading-6 prose-strong:text-white prose-headings:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.vision}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Mission Card */}
        {about?.mission && (
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-emerald-900/30 to-neutral-900/40 p-8 transition-all duration-300 hover:border-emerald-600/50 hover:shadow-2xl hover:shadow-emerald-600/10">
            <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-600/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <div className="prose prose-invert prose-sm max-w-none prose-p:text-neutral-300 prose-p:leading-7 prose-p:mb-4 prose-ul:my-3 prose-ul:ml-4 prose-ul:list-disc prose-li:my-2 prose-li:text-neutral-300 prose-li:leading-6 prose-strong:text-white prose-headings:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.mission}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Approach Card */}
        {about?.approach && (
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-purple-900/30 to-neutral-900/40 p-8 transition-all duration-300 hover:border-purple-600/50 hover:shadow-2xl hover:shadow-purple-600/10">
            <div className="absolute top-0 right-0 h-32 w-32 bg-purple-600/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Approach</h2>
              <div className="prose prose-invert prose-sm max-w-none prose-p:text-neutral-300 prose-p:leading-7 prose-p:mb-4 prose-ul:my-3 prose-ul:ml-4 prose-ul:list-disc prose-li:my-2 prose-li:text-neutral-300 prose-li:leading-6 prose-strong:text-white prose-headings:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.approach}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-purple-600/10" />
        <div className="relative">
          <h3 className="text-3xl font-bold text-white mb-4">{ctaTitle}</h3>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">{ctaDesc}</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-brand-700 hover:scale-105 hover:shadow-lg hover:shadow-brand-600/25"
          >
            {ctaButtonText}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
