import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PKCE confirmation flow: Supabase appends ?code=xxx to emailRedirectTo and
// redirects here. exchangeCodeForSession() exchanges the code for a session
// using the code_verifier stored in the original browser's storage.
//
// Known MVP limitation: if the user opens the confirmation link in a different
// browser or device than the one used to sign up, exchangeCodeForSession()
// will fail with "code verifier missing" — the code_verifier lives in the
// original browser and cannot be reconstructed elsewhere.
// Fix would require custom SMTP (to edit the email template and use
// {{ .TokenHash }} + verifyOtp() instead). Deferred — see docs/TDD.md.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect to login with a visible error — covers: link expired,
  // already used, or opened on a different device than sign-up.
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('error', 'confirmation_failed')
  return NextResponse.redirect(loginUrl)
}
