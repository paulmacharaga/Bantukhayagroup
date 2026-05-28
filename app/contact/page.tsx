import { fetchContactPageFromStrapi } from '@/lib/strapi'
import ContactForm from './ContactForm'

export default async function ContactPage() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const contact = await fetchContactPageFromStrapi(baseUrl, token)

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 py-12">
      <div className="space-y-6">
        {contact?.title && <h1 className="text-5xl font-semibold tracking-tight text-white">{contact.title}</h1>}
        {contact?.subtitle && <p className="text-xl text-neutral-300">{contact.subtitle}</p>}
        {contact?.body && (
          <div
            className="space-y-4 text-sm leading-7 text-neutral-300"
            dangerouslySetInnerHTML={{ __html: contact.body }}
          />
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
          <ContactForm />
        </div>
        <div className="space-y-6">
          {contact?.heroImageUrl && (
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
              <img src={contact.heroImageUrl} alt={contact?.title ?? 'Contact'} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-sm text-neutral-300">
            {contact?.email && (
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Email</div>
                <div className="mt-1 text-base text-white">{contact.email}</div>
              </div>
            )}
            {contact?.phone && (
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Phone</div>
                <div className="mt-1 text-base text-white">{contact.phone}</div>
              </div>
            )}
            {contact?.address && (
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Address</div>
                <div className="mt-1 text-base text-white">{contact.address}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
