import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/container'
import { Card, CardHeader, CardBody, TearLine } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user!.id)
    .single()

  return (
    <main className="flex-1 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink">
            Welcome, {profile?.display_name ?? 'Enthusiast'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Your stats will appear here once you start logging rides.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Credits" value="—" color="text-magenta" note="unique coasters" />
          <StatCard label="Total Rides" value="—" color="text-ink" note="all time" />
          <StatCard label="Countries" value="—" color="text-brand-cyan" note="visited" />
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
  value: string
  color: string
  note: string
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
      </CardHeader>
      <TearLine />
      <CardBody>
        <p className={`font-display text-4xl font-extrabold leading-none ${color}`}>{value}</p>
        <p className="text-xs text-gray-400 mt-1">{note}</p>
      </CardBody>
    </Card>
  )
}
