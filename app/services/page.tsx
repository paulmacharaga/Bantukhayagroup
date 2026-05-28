import { fetchServicesFromStrapi, fetchServicesPageFromStrapi } from '@/lib/strapi'

export default async function ServicesPage() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const [services, servicesPage] = await Promise.all([
    fetchServicesFromStrapi(baseUrl, token),
    fetchServicesPageFromStrapi(baseUrl, token),
  ])

  const heroTitle = servicesPage?.heroTitle || 'Our Services'
  const heroDescription = servicesPage?.heroDescription || 'Bantu Khaya Group delivers comprehensive solutions across consulting and technology ecosystems. Our integrated approach ensures that strategy and implementation work hand-in-hand to drive measurable outcomes for your organization.'
  const consultingTitle = servicesPage?.consultingSectionTitle || 'Consulting Services'
  const consultingDesc = servicesPage?.consultingSectionDescription || 'Strategic guidance to navigate complex challenges and unlock growth opportunities.'
  const techTitle = servicesPage?.technologySectionTitle || 'Technology Ecosystem'
  const techDesc = servicesPage?.technologySectionDescription || 'Cutting-edge technology solutions to modernize operations and enhance customer experiences.'
  const ctaTitle = servicesPage?.ctaTitle || 'Ready to Transform Your Business?'
  const ctaDesc = servicesPage?.ctaDescription || "Let's discuss how our consulting and technology services can help you achieve your goals."
  const ctaButtonText = servicesPage?.ctaButtonText || 'Get in Touch'

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 py-12">
      {/* Hero Section */}
      <div className="space-y-6">
        {servicesPage?.heroImageUrl && (
          <div className="h-64 w-full overflow-hidden rounded-2xl border border-neutral-800">
            <img src={servicesPage.heroImageUrl} alt="Services" className="h-full w-full object-cover" />
          </div>
        )}
        <h1 className="text-5xl font-semibold tracking-tight text-white">{heroTitle}</h1>
        <p className="max-w-3xl text-xl text-neutral-300 leading-relaxed">{heroDescription}</p>
      </div>

      {/* Consulting Services Section */}
      <div className="space-y-8">
        <div className="border-l-4 border-brand-600 pl-6">
          <h2 className="text-3xl font-semibold text-white">{consultingTitle}</h2>
          <p className="mt-2 text-neutral-400">{consultingDesc}</p>
        </div>
        
        {services.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 text-center text-sm text-neutral-400">
            No services yet. Add services in Strapi to get started.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {services.slice(0, 4).map((service, idx) => (
              <div
                key={service.id}
                className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 transition-all hover:border-neutral-700"
              >
                {service.imageUrl && (
                  <div className="h-48 w-full overflow-hidden border-b border-neutral-800">
                    <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    {service.iconUrl ? (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-neutral-700 bg-white">
                        <img src={service.iconUrl} alt={service.title} className="h-6 w-6 object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-neutral-700 bg-white">
                        <span className="text-neutral-900 font-semibold">{service.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-bold tracking-wider text-neutral-500">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-neutral-300">{service.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technology Ecosystem Section */}
      {services.length > 4 && (
        <div className="space-y-8">
          <div className="border-l-4 border-brand-600 pl-6">
            <h2 className="text-3xl font-semibold text-white">{techTitle}</h2>
            <p className="mt-2 text-neutral-400">{techDesc}</p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {services.slice(4).map((service, idx) => (
              <div
                key={service.id}
                className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 transition-all hover:border-neutral-700"
              >
                {service.imageUrl && (
                  <div className="h-48 w-full overflow-hidden border-b border-neutral-800">
                    <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    {service.iconUrl ? (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-neutral-700 bg-white">
                        <img src={service.iconUrl} alt={service.title} className="h-6 w-6 object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-neutral-700 bg-white">
                        <span className="text-neutral-900 font-semibold">{service.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-bold tracking-wider text-neutral-500">
                          {String(idx + 5).padStart(2, '0')}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-neutral-300">{service.desc}</p>
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
