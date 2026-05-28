type StrapiMedia = {
  data?: {
    attributes?: {
      url?: string
    }
  }
}

type StrapiCollection<T> = {
  data: Array<{
    id: number
    attributes: T
  }>
}

type StrapiSingle<T> = {
  data: {
    id: number
    attributes: T
  } | null
}

export type Company = {
  id: string
  name: string
  blurb: string
  color: string
  backgroundColor?: string
  link?: string
  initial?: string
  logoUrl?: string
}

export type Service = {
  id: string
  title: string
  desc: string
  iconUrl?: string
  imageUrl?: string
}

export type Project = {
  id: string
  title: string
  slug: string
  excerpt?: string
  description?: string
  client?: string
  industry?: string
  year?: number
  services?: string[]
  coverImageUrl?: string
  gallery?: string[]
  outcome?: string
  challenges?: string
  publishedAt?: string
}

export type SiteSettings = {
  footerCopyright?: string
  mainLogoUrl?: string
}

export type AboutPage = {
  title?: string
  subtitle?: string
  body?: string
  heroImageUrl?: string
  vision?: string
  mission?: string
  approach?: string
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  hoverDescription?: string
}

export type ContactPage = {
  title?: string
  subtitle?: string
  body?: string
  email?: string
  phone?: string
  address?: string
  heroImageUrl?: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  coverImageUrl?: string
  publishedAt?: string
}

export type NavigationItem = {
  id: string
  label: string
  href: string
  isExternal?: boolean
}

export type ServicesPage = {
  heroTitle?: string
  heroDescription?: string
  consultingSectionTitle?: string
  consultingSectionDescription?: string
  technologySectionTitle?: string
  technologySectionDescription?: string
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  heroImageUrl?: string
}

export type TechnologyPage = {
  heroTitle?: string
  heroDescription?: string
  body?: string
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  heroImageUrl?: string
}

type CompanyAttributes = {
  name: string
  blurb?: string
  color?: string
  backgroundColor?: string
  website?: string
  initial?: string
  logo?: StrapiMedia
}

type ServiceAttributes = {
  title: string
  description?: string
  icon?: StrapiMedia
  image?: StrapiMedia
}

type ProjectAttributes = {
  title: string
  slug: string
  excerpt?: string
  description?: string
  client?: string
  industry?: string
  year?: number
  services?: string[]
  coverImage?: StrapiMedia
  gallery?: StrapiMedia[]
  outcome?: string
  challenges?: string
  publishedAt?: string
}

type SiteSettingsAttributes = {
  footerCopyright?: string
  mainLogo?: StrapiMedia
}

type AboutAttributes = {
  title?: string
  subtitle?: string
  body?: string
  heroImage?: StrapiMedia
}

type ContactAttributes = {
  title?: string
  subtitle?: string
  body?: string
  email?: string
  phone?: string
  address?: string
  heroImage?: StrapiMedia
}

type BlogPostAttributes = {
  title: string
  slug: string
  excerpt?: string
  body?: string
  coverImage?: StrapiMedia
  publishedAt?: string
}

type NavigationItemAttributes = {
  label: string
  href: string
  isExternal?: boolean
  sortOrder?: number
}

const withBaseUrl = (baseUrl: string, url?: string) => {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/$/, '')

export async function fetchCompaniesFromStrapi(baseUrl: string, token?: string): Promise<Company[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/companies?populate=*&sort=sortOrder:asc`, {
    headers,
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  const payload = await res.json()
  return payload.data.map((item: any) => {
    const attrs = item.attributes ?? item
    // Handle both nested (v4) and flat (v5) logo structures
    const logoUrl = attrs.logo?.data?.attributes?.url ?? attrs.logo?.url ?? attrs.logo
    return {
      id: String(item.id),
      name: attrs.name,
      blurb: attrs.blurb ?? '',
      color: attrs.color ?? '#ffffff',
      backgroundColor: attrs.backgroundColor ?? undefined,
      link: attrs.website ?? undefined,
      initial: attrs.initial ?? undefined,
      logoUrl: logoUrl ? withBaseUrl(normalizedBaseUrl, logoUrl) : undefined,
    }
  })
}

export async function fetchServicesFromStrapi(baseUrl: string, token?: string): Promise<Service[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/services?populate=*&sort=sortOrder:asc`, {
    headers,
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  const payload = await res.json()
  const sorted = [...payload.data].sort((a: any, b: any) => {
    const aOrder = a.attributes?.sortOrder ?? a.sortOrder ?? 0
    const bOrder = b.attributes?.sortOrder ?? b.sortOrder ?? 0
    if (aOrder !== bOrder) return aOrder - bOrder
    return (a.id ?? 0) - (b.id ?? 0)
  })
  return sorted.map((item: any) => {
    const attrs = item.attributes ?? item
    return {
      id: String(item.id),
      title: attrs.title,
      desc: attrs.description ?? '',
      iconUrl: withBaseUrl(normalizedBaseUrl, attrs.icon?.data?.attributes?.url ?? attrs.icon?.url ?? attrs.icon),
      imageUrl: withBaseUrl(normalizedBaseUrl, attrs.image?.data?.attributes?.url ?? attrs.image?.url ?? attrs.image),
    }
  })
}

export async function fetchProjectsFromStrapi(baseUrl: string, token?: string): Promise<Project[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/projects?populate=*&sort=sortOrder:asc`, {
    headers,
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  const payload = await res.json()
  return payload.data.map((item: any) => {
    const attrs = item.attributes ?? item
    const coverImageUrl = attrs.coverImage?.data?.attributes?.url ?? attrs.coverImage?.url ?? attrs.coverImage
    const gallery = attrs.gallery?.data?.map((g: any) =>
      withBaseUrl(normalizedBaseUrl, g.attributes?.url ?? g.url ?? g)
    ) ?? attrs.gallery ?? []
    return {
      id: String(item.id),
      title: attrs.title,
      slug: attrs.slug,
      excerpt: attrs.excerpt ?? undefined,
      description: attrs.description ?? undefined,
      client: attrs.client ?? undefined,
      industry: attrs.industry ?? undefined,
      year: attrs.year ?? undefined,
      services: attrs.services ?? undefined,
      coverImageUrl: coverImageUrl ? withBaseUrl(normalizedBaseUrl, coverImageUrl) : undefined,
      gallery,
      outcome: attrs.outcome ?? undefined,
      challenges: attrs.challenges ?? undefined,
      publishedAt: attrs.publishedAt ?? undefined,
    }
  })
}

export async function fetchProjectBySlugFromStrapi(baseUrl: string, slug: string, token?: string): Promise<Project | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`, {
    headers,
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  const payload = await res.json()
  if (!payload.data || payload.data.length === 0) return null
  const item = payload.data[0]
  const attrs = item.attributes ?? item
  const coverImageUrl = attrs.coverImage?.data?.attributes?.url ?? attrs.coverImage?.url ?? attrs.coverImage
  const gallery = attrs.gallery?.data?.map((g: any) =>
    withBaseUrl(normalizedBaseUrl, g.attributes?.url ?? g.url ?? g)
  ) ?? attrs.gallery ?? []
  return {
    id: String(item.id),
    title: attrs.title,
    slug: attrs.slug,
    excerpt: attrs.excerpt ?? undefined,
    description: attrs.description ?? undefined,
    client: attrs.client ?? undefined,
    industry: attrs.industry ?? undefined,
    year: attrs.year ?? undefined,
    services: attrs.services ?? undefined,
    coverImageUrl: coverImageUrl ? withBaseUrl(normalizedBaseUrl, coverImageUrl) : undefined,
    gallery,
    outcome: attrs.outcome ?? undefined,
    challenges: attrs.challenges ?? undefined,
    publishedAt: attrs.publishedAt ?? undefined,
  }
}

export async function fetchSiteSettingsFromStrapi(baseUrl: string, token?: string): Promise<SiteSettings | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/site-setting?populate=*`, { headers, next: { revalidate: 60 } })
  if (!res.ok) return null as any
  const payload = await res.json()
  if (!payload.data) return null
  // Handle both nested attributes structure and flat structure
  const attrs = payload.data.attributes || payload.data
  // Handle both nested (v4) and flat (v5) logo structures
  const logoUrl = attrs.mainLogo?.data?.attributes?.url ?? attrs.mainLogo?.url ?? attrs.mainLogo
  return {
    footerCopyright: attrs.footerCopyright ?? undefined,
    mainLogoUrl: logoUrl ? withBaseUrl(normalizedBaseUrl, logoUrl) : undefined,
  }
}

export async function fetchAboutPageFromStrapi(baseUrl: string, token?: string): Promise<AboutPage | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  try {
    const res = await fetch(`${normalizedBaseUrl}/api/about?populate=*`, { headers, next: { revalidate: 60 } })
    if (!res.ok) return null
    const payload = await res.json()
    if (!payload.data) return null
    // Handle both nested attributes structure and flat structure
    const attrs = payload.data.attributes || payload.data
    return {
      title: attrs.title,
      subtitle: attrs.subtitle,
      body: attrs.body,
      heroImageUrl: withBaseUrl(normalizedBaseUrl, attrs.heroImage?.data?.attributes?.url),
      vision: attrs.vision,
      mission: attrs.mission,
      approach: attrs.approach,
      ctaTitle: attrs.ctaTitle,
      ctaDescription: attrs.ctaDescription,
      ctaButtonText: attrs.ctaButtonText,
      hoverDescription: attrs.hoverDescription,
    }
  } catch {
    return null
  }
}

export async function fetchContactPageFromStrapi(baseUrl: string, token?: string): Promise<ContactPage | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/contact?populate=*`, { headers, next: { revalidate: 60 } })
  if (!res.ok) return null
  const payload = await res.json()
  if (!payload.data) return null
  // Handle both nested attributes structure and flat structure
  const attrs = payload.data.attributes || payload.data
  return {
    title: attrs.title,
    subtitle: attrs.subtitle,
    body: attrs.body,
    email: attrs.email,
    phone: attrs.phone,
    address: attrs.address,
    heroImageUrl: withBaseUrl(normalizedBaseUrl, attrs.heroImage?.data?.attributes?.url),
  }
}

export async function fetchBlogPostsFromStrapi(baseUrl: string, token?: string): Promise<BlogPost[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/blog-posts?populate=*&sort=publishedAt:desc`, {
    headers,
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  const payload = (await res.json()) as StrapiCollection<BlogPostAttributes>
  return payload.data.map(item => {
    const attrs = item.attributes ?? (item as unknown as BlogPostAttributes)
    return {
      id: String(item.id ?? ''),
      title: attrs.title,
      slug: attrs.slug,
      excerpt: attrs.excerpt ?? undefined,
      body: attrs.body ?? undefined,
      coverImageUrl: withBaseUrl(normalizedBaseUrl, attrs.coverImage?.data?.attributes?.url),
      publishedAt: attrs.publishedAt,
    }
  })
}

export async function fetchBlogPostBySlugFromStrapi(
  baseUrl: string,
  slug: string,
  token?: string,
): Promise<BlogPost | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(
    `${normalizedBaseUrl}/api/blog-posts?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`,
    { headers, next: { revalidate: 60 } },
  )
  if (!res.ok) return null
  const payload = (await res.json()) as StrapiCollection<BlogPostAttributes>
  const item = payload.data[0]
  if (!item) return null
  const attrs = item.attributes ?? (item as unknown as BlogPostAttributes)
  return {
    id: String(item.id ?? ''),
    title: attrs.title,
    slug: attrs.slug,
    excerpt: attrs.excerpt ?? undefined,
    body: attrs.body ?? undefined,
    coverImageUrl: withBaseUrl(normalizedBaseUrl, attrs.coverImage?.data?.attributes?.url),
    publishedAt: attrs.publishedAt,
  }
}

export async function fetchNavigationItemsFromStrapi(
  baseUrl: string,
  token?: string,
): Promise<NavigationItem[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}/api/navigation-items?sort=sortOrder:asc`, {
    headers,
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  const payload = (await res.json()) as StrapiCollection<NavigationItemAttributes>
  return payload.data.map(item => {
    const attrs = item.attributes ?? (item as unknown as NavigationItemAttributes)
    return {
      id: String(item.id ?? ''),
      label: attrs.label,
      href: attrs.href,
      isExternal: attrs.isExternal ?? false,
    }
  })
}

type ServicesPageAttributes = {
  heroTitle?: string
  heroDescription?: string
  consultingSectionTitle?: string
  consultingSectionDescription?: string
  technologySectionTitle?: string
  technologySectionDescription?: string
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  heroImage?: StrapiMedia
}

export async function fetchServicesPageFromStrapi(baseUrl: string, token?: string): Promise<ServicesPage | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  try {
    const res = await fetch(`${normalizedBaseUrl}/api/services-page?populate=*`, { headers, next: { revalidate: 60 } })
    if (!res.ok) return null
    const payload = await res.json()
    if (!payload.data) return null
    const attrs = payload.data.attributes || payload.data
    return {
      heroTitle: attrs.heroTitle,
      heroDescription: attrs.heroDescription,
      consultingSectionTitle: attrs.consultingSectionTitle,
      consultingSectionDescription: attrs.consultingSectionDescription,
      technologySectionTitle: attrs.technologySectionTitle,
      technologySectionDescription: attrs.technologySectionDescription,
      ctaTitle: attrs.ctaTitle,
      ctaDescription: attrs.ctaDescription,
      ctaButtonText: attrs.ctaButtonText,
      heroImageUrl: withBaseUrl(normalizedBaseUrl, attrs.heroImage?.data?.attributes?.url),
    }
  } catch (error) {
    return null
  }
}

type TechnologyPageAttributes = {
  heroTitle?: string
  heroDescription?: string
  body?: string
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  heroImage?: StrapiMedia
}

export async function fetchTechnologyPageFromStrapi(baseUrl: string, token?: string): Promise<TechnologyPage | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  try {
    const res = await fetch(`${normalizedBaseUrl}/api/technology-page?populate=*`, { headers, next: { revalidate: 60 } })
    if (!res.ok) return null
    const payload = await res.json()
    if (!payload.data) return null
    const attrs = payload.data.attributes || payload.data
    return {
      heroTitle: attrs.heroTitle,
      heroDescription: attrs.heroDescription,
      body: attrs.body,
      ctaTitle: attrs.ctaTitle,
      ctaDescription: attrs.ctaDescription,
      ctaButtonText: attrs.ctaButtonText,
      heroImageUrl: withBaseUrl(normalizedBaseUrl, attrs.heroImage?.data?.attributes?.url),
    }
  } catch (error) {
    return null
  }
}
