import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import { NavLinks } from './nav-links'

interface NavbarProps {
  displayName?: string | null
  role?: string | null
}

export function Navbar({ displayName, role }: NavbarProps) {
  const isLoggedIn = !!displayName

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={isLoggedIn ? '/dashboard' : '/'}
          className="font-display text-xl font-bold tracking-tight text-ink hover:text-magenta transition-colors shrink-0"
        >
          Credit<span className="text-magenta">Count</span>
        </Link>

        {/* Nav links with active indicator */}
        {isLoggedIn && <NavLinks role={role} />}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[140px]">
                {displayName}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-500 hover:text-ink transition-colors"
                >
                  Sign out
                </button>
              </form>
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
  )
}
