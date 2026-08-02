'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState =
  | { error: string; email?: string }
  | { message: string }
  | undefined

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirm_password = formData.get('confirm_password') as string
  const display_name = (formData.get('display_name') as string).trim()

  if (!display_name || display_name.length < 2) {
    return { error: 'Display name must be at least 2 characters.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  if (password !== confirm_password) {
    return { error: 'Passwords do not match.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // display_name lands in raw_user_meta_data and is picked up by the
      // handle_new_user trigger to populate profiles.display_name.
      data: { display_name },
      // The default {{ .ConfirmationURL }} template respects emailRedirectTo —
      // Supabase will append ?code=xxx to this URL and redirect here after
      // validating the link. No email template editing required.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) return { error: error.message }

  // Supabase doesn't return an error for duplicate emails (prevents enumeration
  // from the outside), but signals it via an empty identities array.
  if (data.user?.identities?.length === 0) {
    return { error: 'An account with this email already exists. Log in instead.' }
  }

  return {
    message:
      'Account created! Check your inbox and click the confirmation link to activate it.',
  }
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      // Surface the email so the login page can pre-fill the resend form.
      return { error: 'email_not_confirmed', email }
    }
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resendConfirmationEmail(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string
  if (!email) return { error: 'Email address is required.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.resend({ type: 'signup', email })

  if (error) return { error: error.message }
  return { message: 'Confirmation email resent — check your inbox.' }
}
