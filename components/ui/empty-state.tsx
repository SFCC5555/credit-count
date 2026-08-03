import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 px-4 text-center',
        className,
      )}
    >
      {icon && (
        <div className="text-gray-300 mb-1" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-gray-500">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
