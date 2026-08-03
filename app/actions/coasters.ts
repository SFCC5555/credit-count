'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (data?.role !== 'admin') return null
  return supabase
}

function coasterFields(formData: FormData) {
  return {
    name:         (formData.get('name')         as string).trim(),
    park:         (formData.get('park')         as string).trim(),
    country:      (formData.get('country')      as string).trim(),
    type:         (formData.get('type')         as string).trim(),
    manufacturer: (formData.get('manufacturer') as string).trim(),
  }
}

function revalidate() {
  revalidatePath('/catalog')
  revalidatePath('/admin/coasters')
}

export async function createCoaster(_prev: unknown, formData: FormData) {
  const supabase = await verifyAdmin()
  if (!supabase) return { error: 'Unauthorized' }

  const { error } = await supabase.from('coasters').insert(coasterFields(formData))
  if (error) return { error: error.message }

  revalidate()
  return { success: true as const }
}

export async function updateCoaster(_prev: unknown, formData: FormData) {
  const supabase = await verifyAdmin()
  if (!supabase) return { error: 'Unauthorized' }

  const id = formData.get('coaster_id') as string
  const { error } = await supabase.from('coasters').update(coasterFields(formData)).eq('id', id)
  if (error) return { error: error.message }

  revalidate()
  return { success: true as const }
}

export async function deleteCoaster(coasterId: string) {
  const supabase = await verifyAdmin()
  if (!supabase) return { error: 'Unauthorized' as const }

  const { error } = await supabase.from('coasters').delete().eq('id', coasterId)
  if (error) {
    if (error.code === '23503') return { error: 'fk_violation' as const }
    return { error: error.message }
  }

  revalidate()
  return { success: true as const }
}
