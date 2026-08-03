import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn('px-6 pt-5 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ children, className, ...props }: CardProps) {
  return (
    <div className={cn('px-6 pt-4 pb-5', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Perforated tear-line divider — the one signature ticket detail.
 * Use inside a Card between CardHeader and CardBody.
 * Circles bleed 8px past the card's horizontal padding to sit on the border.
 */
export function TearLine() {
  return (
    <div className="relative -mx-px h-px bg-gray-100" aria-hidden="true">
      {/* dashed overlay */}
      <div className="absolute inset-0 border-t border-dashed border-gray-200" />
      {/* left punch hole */}
      <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-paper border border-gray-200 shadow-inner" />
      {/* right punch hole */}
      <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-paper border border-gray-200 shadow-inner" />
    </div>
  )
}
