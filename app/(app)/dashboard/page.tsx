import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/container'
import { Card, CardHeader, CardBody, TearLine } from '@/components/ui/card'
import { PrivacyToggle } from '@/components/privacy-toggle'
import { DashboardLogButton } from './dashboard-log-button'
import { type RideWithCoaster } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profileRes, ridesRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('display_name, private')
      .eq('id', user!.id)
      .single(),
    supabase
      .from('rides')
      .select('id, coaster_id, ride_date, note, created_at, coasters(id, name, park, country, type, manufacturer)')
      .eq('user_id', user!.id)
      .order('ride_date', { ascending: false }),
  ])

  const profile = profileRes.data
  const rides = (ridesRes.data ?? []) as unknown as RideWithCoaster[]

  const credits = new Set(rides.map(r => r.coaster_id)).size
  const totalRides = rides.length
  const countries = new Set(rides.map(r => r.coasters?.country).filter(Boolean)).size

  /* Leaderboard rank — only fetched when user is public */
  let rank: number | null = null
  if (!profile?.private && profile?.display_name) {
    const { data: board } = await supabase.rpc('public_leaderboard')
    if (board) {
      const idx = (board as { display_name: string }[]).findIndex(
        r => r.display_name === profile.display_name,
      )
      if (idx !== -1) rank = idx + 1
    }
  }

  return (
    <main className="flex-1 py-8">
      <Container>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">
              Welcome, {profile?.display_name ?? 'Enthusiast'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {totalRides === 0
                ? 'Log your first ride to get started.'
                : `${totalRides} ride${totalRides !== 1 ? 's' : ''} logged.`}
            </p>
          </div>
          <DashboardLogButton />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Left — Credits */}
          <Card className="flex flex-col">
            <CardHeader className="text-center !pt-8 pb-8 flex items-center justify-center">
              <p className="text-3xl font-bold uppercase tracking-widest text-ink">Credits</p>
            </CardHeader>
            <TearLine />
            <CardBody className="flex-1 flex flex-col items-center justify-center py-8">
              <p className="font-display text-[10rem] font-extrabold leading-none animate-breathe-color">
                {credits}
              </p>
              <p className="text-sm text-gray-400 mt-2">unique coasters</p>
              {rank !== null && (
                <p className="mt-3 text-xs font-medium text-gray-400">
                  Ranked{' '}
                  <span className="font-bold text-magenta">#{rank}</span>
                  {' '}on the leaderboard
                </p>
              )}
            </CardBody>
          </Card>

          {/* Right — Total Rides on top, Countries below */}
          <div className="flex flex-col gap-4">
            <StatCard label="Total Rides" value={totalRides} color="text-ink" note="all time" />
            <StatCard label="Countries" value={countries} color="text-ink" note="visited" />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
            Leaderboard visibility
          </p>
          <PrivacyToggle isPrivate={profile?.private ?? true} />
        </div>
      </Container>
    </main>
  )
}

function StatCard({
  label,
  value,
  color,
  note,
}: {
  label: string
  value: number
  color: string
  note: string
}) {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
      </CardHeader>
      <TearLine />
      <CardBody>
        <p className={`font-display text-4xl font-extrabold leading-none ${color}`}>
          {value}
        </p>
        <p className="text-xs text-gray-400 mt-1">{note}</p>
      </CardBody>
    </Card>
  )
}
