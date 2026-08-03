import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Container } from '@/components/container'
import {
  Table, TableHead, TableBody, TableRow, Th, Td,
} from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'

interface LeaderboardRow {
  display_name: string
  credits: number
}

const medals: Record<number, string> = { 1: '▲', 2: '▲', 3: '▲' }
const medalColors: Record<number, string> = {
  1: 'text-yellow-500',
  2: 'text-zinc-400',
  3: 'text-amber-600',
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  /* Optional auth — Navbar shows user info if logged in */
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { display_name: string; role: string } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  /* Leaderboard data — public_leaderboard() is SECURITY DEFINER, callable by anon */
  const { data: leaderboard } = await supabase.rpc('public_leaderboard')
  const rows: LeaderboardRow[] = leaderboard ?? []

  return (
    <>
      <Navbar displayName={profile?.display_name} role={profile?.role} />

      <main className="flex-1 py-12">
        <Container size="md">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-ink">
              Leaderboard
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Public credit counts — only enthusiasts who opted in.
            </p>
          </div>

          {/* Table */}
          {rows.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <Th className="w-14 text-center">#</Th>
                  <Th>Enthusiast</Th>
                  <Th className="text-right pr-6">Credits</Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => {
                  const rank = i + 1
                  return (
                    <TableRow key={`${row.display_name}-${i}`}>
                      <Td className="text-center">
                        {rank <= 3 ? (
                          <span className={`text-xs font-bold ${medalColors[rank]}`}>
                            {rank}
                          </span>
                        ) : (
                          <span className="text-gray-300 tabular-nums text-sm">{rank}</span>
                        )}
                      </Td>
                      <Td className={rank <= 3 ? 'font-semibold text-ink' : 'font-medium'}>
                        {row.display_name}
                      </Td>
                      <Td className="text-right pr-6">
                        <span className="font-display text-xl font-bold text-magenta tabular-nums">
                          {row.credits}
                        </span>
                      </Td>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={
                <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              }
              title="No public rankings yet"
              description="Log your rides and opt in to appear on the leaderboard."
            />
          )}

          {/* CTA for visitors */}
          {!user && (
            <p className="mt-10 text-center text-sm text-gray-400">
              Want to track your own credits?{' '}
              <Link href="/signup" className="font-medium text-magenta hover:text-magenta/80 transition-colors">
                Sign up
              </Link>
              {' '}or{' '}
              <Link href="/login" className="font-medium text-gray-500 hover:text-ink transition-colors">
                log in
              </Link>
            </p>
          )}

        </Container>
      </main>
    </>
  )
}
