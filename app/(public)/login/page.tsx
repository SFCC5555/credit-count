'use client'

import { Suspense, useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn, resendConfirmationEmail, type AuthState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

function LoginContent() {
  const searchParams = useSearchParams()
  const confirmationFailed = searchParams.get('error') === 'confirmation_failed'

  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    undefined,
  )
  const [resendState, resendAction, resendPending] = useActionState<AuthState, FormData>(
    resendConfirmationEmail,
    undefined,
  )

  const emailNotConfirmed =
    state && 'error' in state && state.error === 'email_not_confirmed'

  return (
    <>
      {confirmationFailed && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Confirmation link is invalid or has expired — request a new one below.
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />

        {state && 'error' in state && !emailNotConfirmed && (
          <p role="alert" className="text-sm text-red-500">
            {state.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" loading={pending}>
          Sign in
        </Button>
      </form>

      {emailNotConfirmed && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 space-y-2">
          <p className="font-medium">Email not confirmed yet</p>
          <p>Check your inbox or request a new link.</p>
          <form action={resendAction}>
            <input
              type="hidden"
              name="email"
              value={state && 'email' in state ? (state.email ?? '') : ''}
            />
            <Button type="submit" variant="ghost" size="sm" loading={resendPending}>
              Resend confirmation email
            </Button>
          </form>
          {resendState && 'message' in resendState && (
            <p className="text-emerald-700">{resendState.message}</p>
          )}
          {resendState && 'error' in resendState && (
            <p className="text-red-600">{resendState.error}</p>
          )}
        </div>
      )}
    </>
  )
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="font-display text-4xl font-extrabold tracking-tight text-ink">
            Credit<span className="text-magenta">Count</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">Your coaster credit tracker</p>
        </div>

        <Card className="p-6 space-y-4">
          <h1 className="font-display text-xl font-bold text-ink">Log in</h1>
          <Suspense>
            <LoginContent />
          </Suspense>
        </Card>

        <p className="text-center text-sm text-gray-500">
          No account?{' '}
          <Link
            href="/signup"
            className="font-medium text-magenta hover:text-magenta/80 transition-colors"
          >
            Sign up
          </Link>
        </p>

        <p className="text-center text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            &larr; Back to leaderboard
          </Link>
        </p>
      </div>
    </main>
  )
}
