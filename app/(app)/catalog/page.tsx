import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/container'
import { CoasterList } from './coaster-list'
import { type Coaster } from '@/lib/types'

export default async function CatalogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [coastersRes, ridesRes] = await Promise.all([
    supabase
      .from('coasters')
      .select('id, name, park, country, manufacturer, type, created_at')
      .order('name'),
    supabase
      .from('rides')
      .select('coaster_id')
      .eq('user_id', user!.id),
  ])

  const coasters = (coastersRes.data ?? []) as Coaster[]

  const rideCounts: Record<string, number> = {}
  for (const r of ridesRes.data ?? []) {
    rideCounts[r.coaster_id] = (rideCounts[r.coaster_id] ?? 0) + 1
  }

  return (
    <main className="flex-1 py-8">
      <Container>
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-3xl font-bold text-ink">Rollercoaster Catalogue</h1>
            <span className="text-base text-gray-500">{coasters.length} coasters in the database.</span>
          </div>
        </div>
        <CoasterList coasters={coasters} rideCounts={rideCounts} />
      </Container>
    </main>
  )
}
