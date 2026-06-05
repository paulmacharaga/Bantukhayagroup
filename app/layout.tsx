import type { Metadata } from 'next'
import './globals.css'
import PageChrome from '@/components/PageChrome'
import StarField from '@/components/StarField'
import { fetchNavigationItemsFromStrapi, fetchSiteSettingsFromStrapi } from '@/lib/strapi'

export const metadata: Metadata = {
  title: {
    default: 'Bantu Khaya Group',
    template: '%s | Bantu Khaya Group',
  },
  description: 'Bantu Khaya Group helps organizations deliver complex projects with credible, proven implementation experience and measurable outcomes.',
  keywords: [
    'Bantu Khaya Group',
    'implementation partners',
    'project delivery',
    'infrastructure solutions',
    'systems integration',
    'case studies',
    'trusted advisors',
  ],
  openGraph: {
    title: 'Bantu Khaya Group',
    description: 'Generate qualified leads with a trusted implementation partner showcasing proven delivery experience and outcomes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bantu Khaya Group',
    description: 'Generate qualified leads with a trusted implementation partner showcasing proven delivery experience and outcomes.',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.STRAPI_URL
  if (!baseUrl) {
    throw new Error('STRAPI_URL is not set')
  }
  const token = process.env.STRAPI_API_TOKEN
  const [siteSettings, navigationItems] = await Promise.all([
    fetchSiteSettingsFromStrapi(baseUrl, token),
    fetchNavigationItemsFromStrapi(baseUrl, token),
  ])

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-neutral-950 text-neutral-100">
        <StarField reduce={false} />
        <PageChrome footerText={siteSettings?.footerCopyright} navItems={navigationItems} logoUrl={siteSettings?.mainLogoUrl}>
          {children}
        </PageChrome>
      </body>
    </html>
  )
}
