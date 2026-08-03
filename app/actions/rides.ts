'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type RideActionState = { error: string } | { success: true } | undefined

export async function logRide(
  _prev: RideActionState,
  formData: FormData,
): Promise<RideActionState> {
  const coaster_id = formData.get('coaster_id') as string
  const ride_date = formData.get('ride_date') as string
  const note = ((formData.get('note') as string) ?? '').trim() || null

  if (!coaster_id) return { error: 'Please select a coaster.' }
  if (!ride_date) return { error: 'Please select a date.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { error } = await supabase.from('rides').insert({
    user_id: user.id,
    coaster_id,
    ride_date,
    note,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/rides')
  revalidatePath('/')
  return { success: true }
}

export async function updateRide(
  _prev: RideActionState,
  formData: FormData,
): Promise<RideActionState> {
  const ride_id = formData.get('ride_id') as string
  const ride_date = formData.get('ride_date') as string
  const note = ((formData.get('note') as string) ?? '').trim() || null

  if (!ride_id || !ride_date) return { error: 'Missing required fields.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('rides')
    .update({ ride_date, note })
    .eq('id', ride_id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/rides')
  return { success: true }
}

export async function deleteRide(rideId: string): Promise<RideActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('rides')
    .delete()
    .eq('id', rideId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/rides')
  revalidatePath('/')
  return { success: true }
}

export async function updatePrivacy(isPrivate: boolean): Promise<RideActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('profiles')
    .update({ private: isPrivate })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}
