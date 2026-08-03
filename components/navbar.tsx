'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

interface NavbarProps {
  displayName?: string | null
  role?: string | null
}

const links = [
  { href: '/',          label: 'Leaderboard', exact: true  },
  { href: '/dashboard', label: 'Dashboard',   exact: false },
  { href: '/catalog',   label: 'Catalogue',   exact: false },
  { href: '/rides',     label: 'Rides',       exact: false },
]

export function Navbar({ displayName, role }: NavbarProps) {
  const pathname = usePathname()
  const isLoggedIn = !!displayName
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  const allLinks = [
    ...links,
    ...(role === 'admin' ? [{ href: '/admin/coasters', label: 'Admin', exact: false }] : []),
  ]

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex h-14 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-ink hover:text-magenta transition-colors shrink-0"
          >
            Credit<span className="text-magenta">Count</span>
          </Link>

          {/* Desktop nav — hidden on mobile */}
          {isLoggedIn && (
            <nav className="hidden sm:flex items-center gap-1">
              {links.map(({ href, label, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'px-3 py-1 text-sm font-medium transition-colors border-b-2',
                      active
                        ? 'text-ink border-magenta'
                        : 'text-gray-400 border-transparent hover:text-gray-700',
                    )}
                  >
                    {label}
                  </Link>
                )
              })}
              {role === 'admin' && (
                <Link
                  href="/admin/coasters"
                  className={cn(
                    'px-3 py-1 text-sm font-medium transition-colors border-b-2',
                    pathname.startsWith('/admin')
                      ? 'text-brand-cyan border-brand-cyan'
                      : 'text-brand-cyan/60 border-transparent hover:text-brand-cyan',
                  )}
                >
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Display name + sign out — desktop only */}
                <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[140px]">
                  {displayName}
                </span>
                <form action={signOut} className="hidden sm:block">
                  <button
                    type="submit"
                    className="text-sm font-medium text-gray-500 hover:text-ink transition-colors"
                  >
                    Sign out
                  </button>
                </form>

                {/* Hamburger — mobile only */}
                <button
                  className="sm:hidden p-2 -mr-1 text-gray-500 hover:text-ink transition-colors"
                  onClick={() => setOpen((v) => !v)}
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                >
                  {open ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-500 hover:text-ink transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-magenta text-white text-sm font-medium hover:bg-magenta/85 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Mobile dropdown menu */}
      {isLoggedIn && open && (
        <div className="fixed top-14 inset-x-0 z-40 bg-white border-b border-gray-100 shadow-lg sm:hidden">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {allLinks.map(({ href, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href)
              const isAdmin = href.startsWith('/admin')
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-2',
                    active
                      ? isAdmin
                        ? 'bg-cyan-50 text-brand-cyan border-brand-cyan'
                        : 'bg-pink-50 text-ink border-magenta'
                      : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-ink',
                  )}
                >
                  {label}
                </Link>
              )
            })}

            {/* Sign out at the bottom of mobile menu */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="px-3 py-1 text-xs text-gray-400">{displayName}</p>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-ink transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
