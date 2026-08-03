import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/container'
import { RideList } from './ride-list'
import { type RideWithCoaster } from '@/lib/types'

export default async function RidesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('rides')
    .select('id, coaster_id, ride_date, note, created_at, coasters(id, name, park, country, type, manufacturer)')
    .eq('user_id', user!.id)
    .order('ride_date', { ascending: false })

  const rides = (data ?? []) as unknown as RideWithCoaster[]

  return (
    <main className="flex-1 py-8">
      <Container>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-display text-3xl font-bold text-ink">Rides</h1>
              <span className="text-base text-gray-500">Your full ride history.</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {rides.length} {rides.length === 1 ? 'ride' : 'rides'} logged
            </p>
          </div>
          <Link
            href="/catalog"
            className="shrink-0 animate-breathe-shadow inline-flex items-center justify-center font-medium rounded-lg border border-transparent bg-magenta text-white text-sm px-4 py-2 hover:bg-magenta/85 transition-colors"
          >
            Log a ride
          </Link>
        </div>
        <RideList rides={rides} />
      </Container>
    </main>
  )
}
