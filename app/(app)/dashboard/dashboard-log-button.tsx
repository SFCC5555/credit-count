import Link from 'next/link'

export function DashboardLogButton() {
  return (
    <Link
      href="/catalog"
      className="shrink-0 animate-breathe-shadow inline-flex items-center justify-center font-medium rounded-lg border border-transparent bg-magenta text-white text-sm px-4 py-2 gap-2 hover:bg-magenta/85 transition-colors"
    >
      Log a ride
    </Link>
  )
}
