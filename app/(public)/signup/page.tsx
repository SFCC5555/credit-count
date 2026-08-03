'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { signUp, type AuthState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signUp,
    undefined,
  )

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const succeeded = state && 'message' in state

  return (
    <main className="flex flex-1 items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="font-display text-4xl font-extrabold tracking-tight text-ink">
            Credit<span className="text-magenta">Count</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">Create your account</p>
        </div>

        <Card className="p-6 space-y-4">
          <h1 className="font-display text-xl font-bold text-ink">Sign up</h1>

          {succeeded ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
                {state.message}
              </div>
              <Link href="/login">
                <Button variant="ghost" className="w-full">Back to log in</Button>
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <Input
                label="Display name"
                name="display_name"
                type="text"
                required
                minLength={2}
                autoComplete="nickname"
                placeholder="KoinEnthusiast"
                helper="Your public name on the leaderboard."
              />
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
                minLength={8}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Confirm password"
                name="confirm_password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={passwordMismatch ? 'Passwords do not match.' : undefined}
              />

              {state && 'error' in state && (
                <p role="alert" className="text-sm text-red-500">
                  {state.error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={pending || passwordMismatch}
                loading={pending}
              >
                Create account
              </Button>
            </form>
          )}
        </Card>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-magenta hover:text-magenta/80 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
