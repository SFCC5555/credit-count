import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/container'
import { CoasterAdminList } from './coaster-admin-list'
import { type Coaster } from '@/lib/types'

export default async function AdminCoastersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data } = await supabase
    .from('coasters')
    .select('id, name, park, country, manufacturer, type, created_at')
    .order('name')

  const coasters = (data ?? []) as Coaster[]

  return (
    <main className="flex-1 py-8">
      <Container>
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-ink">Coaster Management</h1>
          <p className="text-sm text-gray-400 mt-1">
            Add, edit, and remove coasters from the catalogue.
          </p>
        </div>
        <CoasterAdminList coasters={coasters} />
      </Container>
    </main>
  )
}
