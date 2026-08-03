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
      .order('ride_date', { ascending: false })
      .order('created_at', { ascending: false }),
  ])

  const profile = profileRes.data
  const rides = (ridesRes.data ?? []) as unknown as RideWithCoaster[]

  const credits   = new Set(rides.map(r => r.coaster_id)).size
  const totalRides = rides.length

  /* Breakdowns — all computed from the existing rides array */
  const creditsByCountry      = breakdown(rides, r => r.coasters?.country)
  const creditsByManufacturer = breakdown(rides, r => r.coasters?.manufacturer)
  const creditsByType         = breakdown(rides, r => r.coasters?.type)

  /* Most-ridden coaster */
  const rideCountMap = new Map<string, { name: string; park: string; country: string; type: string; count: number }>()
  for (const r of rides) {
    const entry = rideCountMap.get(r.coaster_id)
    if (entry) entry.count++
    else rideCountMap.set(r.coaster_id, {
      name: r.coasters?.name ?? '?',
      park: r.coasters?.park ?? '',
      country: r.coasters?.country ?? '',
      type: r.coasters?.type ?? '',
      count: 1,
    })
  }
  const mostRidden = rideCountMap.size > 0
    ? [...rideCountMap.values()].sort((a, b) => b.count - a.count)[0]
    : null

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
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">
              Welcome, {profile?.display_name ?? 'Enthusiast'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">Your credits and stats.</p>
          </div>
          <DashboardLogButton />
        </div>

        {/* Top row — Credits + summary stats */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-4">
          {/* Credits */}
          <Card className="flex flex-col">
            <CardHeader className="text-center !pt-8 pb-8 flex items-center justify-center">
              <p className="text-3xl font-bold uppercase tracking-widest text-ink flex items-center gap-3">
                <span className="text-ink text-lg">●</span>
                Credits
                <span className="text-ink text-lg">●</span>
              </p>
            </CardHeader>
            <TearLine />
            <CardBody className="flex-1 flex flex-col items-center justify-center py-8">
              <p className="font-display text-[10rem] font-extrabold leading-none animate-breathe-color">
                {credits}
              </p>
              <p className="text-sm text-gray-400 mt-2">unique coasters</p>
              {rank !== null && (
                <p className="mt-3 text-xs font-medium text-gray-400">
                  Ranked <span className="font-bold text-magenta">#{rank}</span> on the leaderboard
                </p>
              )}
            </CardBody>
          </Card>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <StatCard label="Total Rides" value={totalRides} note="all time" />
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Most Ridden</p>
              </CardHeader>
              <TearLine />
              <CardBody className="flex-1 flex flex-col justify-center">
                {mostRidden ? (
                  <>
                    <p className="font-display text-xl font-bold text-ink leading-tight">{mostRidden.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{mostRidden.park} · {mostRidden.country}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">{mostRidden.type}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs font-semibold text-magenta">
                        {mostRidden.count} ride{mostRidden.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-300">No rides yet</p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Breakdown row */}
        <div className="grid sm:grid-cols-3 gap-x-8 gap-y-4 mb-2">
          <BreakdownCard title="By Country"      unit="countries"    rows={creditsByCountry.map(r => ({ label: r.key, value: r.credits }))} />
          <BreakdownCard title="By Type"         unit="types"        rows={creditsByType.map(r => ({ label: r.key, value: r.credits }))} />
          <BreakdownCard title="By Manufacturer" unit="manufacturers" rows={creditsByManufacturer.map(r => ({ label: r.key, value: r.credits }))} />
        </div>


        {/* Privacy */}
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

/* ── helpers ── */

function breakdown(rides: RideWithCoaster[], key: (r: RideWithCoaster) => string | undefined) {
  const map = new Map<string, Set<string>>()
  for (const r of rides) {
    const k = key(r)
    if (!k) continue
    if (!map.has(k)) map.set(k, new Set())
    map.get(k)!.add(r.coaster_id)
  }
  return [...map.entries()]
    .map(([k, ids]) => ({ key: k, credits: ids.size }))
    .sort((a, b) => b.credits - a.credits)
}

function StatCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
      </CardHeader>
      <TearLine />
      <CardBody>
        <p className="font-display text-4xl font-extrabold leading-none text-ink">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{note}</p>
      </CardBody>
    </Card>
  )
}

function BreakdownCard({ title, unit, rows }: { title: string; unit: string; rows: { label: string; value: number }[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{title}</p>
          {rows.length > 0 && (
            <span className="text-xs font-semibold text-ink tabular-nums">
              <span className="text-[12.5px]">●</span> {rows.length} {unit}
            </span>
          )}
        </div>
      </CardHeader>
      <TearLine />
      {rows.length === 0 ? (
        <CardBody>
          <p className="text-sm text-gray-300">No data yet</p>
        </CardBody>
      ) : (
        <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
          {rows.map(({ label, value }, i) => (
            <li key={label} className="flex items-center gap-3 px-4 py-2.5">
              <span className="text-xs text-gray-300 tabular-nums w-4 shrink-0 text-right">{i + 1}</span>
              <span className="text-sm text-ink truncate flex-1">{label}</span>
              <span className="font-display font-bold text-magenta tabular-nums shrink-0">{value}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
