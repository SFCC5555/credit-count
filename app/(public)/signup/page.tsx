'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { signUp, type AuthState } from '@/app/actions/auth'

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
    <main>
      <h1>Create account</h1>

      {succeeded ? (
        <div>
          <p>{state.message}</p>
          <p>
            <Link href="/login">Back to log in</Link>
          </p>
        </div>
      ) : (
        <form action={formAction}>
          <div>
            <label htmlFor="display_name">Display name</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              required
              minLength={2}
              autoComplete="nickname"
            />
          </div>
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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm_password">Confirm password</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordMismatch && (
              <p role="alert">Passwords do not match.</p>
            )}
          </div>

          {state && 'error' in state && (
            <p role="alert">{state.error}</p>
          )}

          <button type="submit" disabled={pending || passwordMismatch}>
            {pending ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      )}

      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  )
}
