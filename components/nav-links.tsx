'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinksProps {
  role?: string | null
}

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/catalog',   label: 'Catalogue' },
  { href: '/rides',     label: 'Rides' },
]

export function NavLinks({ role }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className="hidden sm:flex items-center gap-1">
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href)
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
  )
}
