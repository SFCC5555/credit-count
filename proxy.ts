import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require a session. Route groups like (app) don't appear in URLs —
// these are the actual pathnames that live inside app/(app)/.
const PROTECTED = ['/dashboard', '/catalog', '/rides', '/admin']

// Routes that should redirect authenticated users away (no point re-logging in).
const AUTH_ROUTES = ['/login', '/signup']

export default async function proxy(request: NextRequest) {
  // supabaseResponse must be the object returned (or used as the base for any
  // redirect) so that Supabase's cookie rotation is always forwarded to the
  // browser. Never return a plain NextResponse.next() after this point.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write updated cookies back into the request so downstream middleware
          // (if any) sees them, then re-create supabaseResponse so the
          // Set-Cookie headers are included in what the browser receives.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // getUser() validates the JWT and refreshes the session if the access token
  // has expired. Do not add any logic between createServerClient and this call.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on every route except Next.js internals and static assets.
    // _next/data routes are intentionally included so RSC data fetches
    // for protected pages are also guarded.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
