import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Defense-in-depth: the proxy already redirects unauthenticated users before
// rendering, but this layout re-checks server-side at render time to catch any
// edge case where the proxy matcher doesn't apply (e.g. a new protected route
// added without updating the PROTECTED list in proxy.ts).
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <>{children}</>
}
