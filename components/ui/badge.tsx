import { cn } from '@/lib/utils'

type CoasterType = 'Steel' | 'Wooden' | 'Hybrid'
type BadgeVariant = 'steel' | 'wooden' | 'hybrid' | 'magenta' | 'cyan' | 'gray'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  steel:   'bg-zinc-100 text-zinc-700 border-zinc-200',
  wooden:  'bg-amber-50 text-amber-700 border-amber-200',
  hybrid:  'bg-cyan-50 text-brand-cyan border-cyan-200',
  magenta: 'bg-pink-50 text-magenta border-pink-200',
  cyan:    'bg-cyan-50 text-brand-cyan border-cyan-200',
  gray:    'bg-gray-100 text-gray-600 border-gray-200',
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border tracking-wide',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function CoasterTypeBadge({ type }: { type: string }) {
  const variant = (type.toLowerCase() as CoasterType).toLowerCase()
  const map: Record<string, BadgeVariant> = {
    steel:  'steel',
    wooden: 'wooden',
    hybrid: 'hybrid',
  }
  return <Badge variant={map[variant] ?? 'gray'}>{type}</Badge>
}
