import OrbitNetwork from '@/components/OrbitNetwork'
import { fetchCompaniesFromStrapi, fetchServicesFromStrapi, fetchAboutPageFromStrapi, fetchSiteSettingsFromStrapi } from '@/lib/strapi'

export default async function Page() {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const [companies, services, about, siteSettings] = await Promise.all([
    fetchCompaniesFromStrapi(baseUrl, token),
    fetchServicesFromStrapi(baseUrl, token),
    fetchAboutPageFromStrapi(baseUrl, token),
    fetchSiteSettingsFromStrapi(baseUrl, token),
  ])

  return (
    <main className="flex h-screen w-full items-center justify-center overflow-hidden pt-16 pb-14">
      <OrbitNetwork companies={companies} services={services} about={about} siteSettings={siteSettings} />
    </main>
  )
}
