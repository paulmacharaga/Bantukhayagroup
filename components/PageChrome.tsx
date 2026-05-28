"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { NavigationItem } from '@/lib/strapi'

type Props = {
  children: ReactNode
  footerText?: string
  navItems: NavigationItem[]
  logoUrl?: string
}

export default function PageChrome({ children, footerText, navItems, logoUrl }: Props) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={
      isHome
        ? 'relative h-screen overflow-hidden text-neutral-100'
        : 'relative min-h-screen text-neutral-100'
    }>
      <header
        className={
          isHome
            ? 'absolute left-0 right-0 top-0 z-40 border-b border-neutral-800/70 bg-neutral-950/70 backdrop-blur'
            : 'border-b border-neutral-800/70 bg-neutral-950/70 backdrop-blur'
        }
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <Link href="/">
              {logoUrl ? (
                <img src={logoUrl} alt="Bantu Khaya" className="h-12 w-auto object-contain" />
              ) : (
                <div className="text-lg uppercase tracking-[0.25em] text-neutral-400">Bantu Khaya</div>
              )}
            </Link>
            <nav
              className={
                `hidden md:flex md:flex-row md:items-center md:justify-center md:gap-2 text-sm font-medium text-neutral-200`
              }
            >
              {navItems.map(item => {
                const normalizedHref = item.href.startsWith('/') ? item.href : `/${item.href}`
                const isActive = pathname === normalizedHref
                return (
                  <Link
                    key={item.href}
                    href={normalizedHref}
                    className={
                      isActive
                        ? 'px-4 py-2 rounded-lg bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                        : 'px-4 py-2 rounded-lg text-neutral-300 transition-all hover:bg-neutral-800 hover:text-white'
                    }
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <button
              type="button"
              className="rounded-md border border-neutral-800/70 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-neutral-300 transition hover:border-neutral-700 hover:text-white md:hidden"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              Menu
            </button>
          </div>
          <nav
            className={
              `mt-4 ${menuOpen ? 'flex' : 'hidden'} flex-col gap-3 text-sm font-medium text-neutral-200 md:hidden`
            }
          >
            {navItems.map(item => {
              const normalizedHref = item.href.startsWith('/') ? item.href : `/${item.href}`
              const isActive = pathname === normalizedHref
              return (
                <Link
                  key={item.href}
                  href={normalizedHref}
                  className={
                    isActive
                      ? 'text-white'
                      : 'transition-colors hover:text-white'
                  }
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {isHome ? (
        <>{children}</>
      ) : (
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
          {children}
        </main>
      )}

      <footer
        className={
          isHome
            ? 'absolute bottom-0 left-0 right-0 border-t border-neutral-800/70 bg-neutral-950/70 px-6 py-4 text-center text-xs text-neutral-400'
            : 'border-t border-neutral-800/70 bg-neutral-950/70 px-6 py-6 text-center text-xs text-neutral-400'
        }
      >
        {footerText ?? ''}
      </footer>
    </div>
  )
}
