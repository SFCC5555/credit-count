'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn, resendConfirmationEmail, type AuthState } from '@/app/actions/auth'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const confirmationFailed = searchParams.get('error') === 'confirmation_failed'

  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    undefined,
  )
  const [resendState, resendAction, resendPending] = useActionState<
    AuthState,
    FormData
  >(resendConfirmationEmail, undefined)

  const emailNotConfirmed =
    state && 'error' in state && state.error === 'email_not_confirmed'

  return (
    <main>
      <h1>Log in</h1>

      {confirmationFailed && (
        <p>Confirmation link is invalid or has expired. Please try again or request a new one.</p>
      )}

      <form action={formAction}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {state && 'error' in state && !emailNotConfirmed && (
          <p role="alert">{state.error}</p>
        )}

        <button type="submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {emailNotConfirmed && (
        <div>
          <p>
            Your email is not confirmed yet. Check your inbox or request a new
            confirmation link.
          </p>
          <form action={resendAction}>
            <input
              type="hidden"
              name="email"
              value={state && 'email' in state ? (state.email ?? '') : ''}
            />
            <button type="submit" disabled={resendPending}>
              {resendPending ? 'Sending…' : 'Resend confirmation email'}
            </button>
          </form>
          {resendState && 'message' in resendState && (
            <p>{resendState.message}</p>
          )}
          {resendState && 'error' in resendState && (
            <p role="alert">{resendState.error}</p>
          )}
        </div>
      )}

      <p>
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  )
}
