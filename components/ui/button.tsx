import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-magenta text-white hover:bg-magenta/85 focus-visible:ring-magenta/50 border-transparent',
  secondary:
    'bg-brand-cyan text-white hover:bg-brand-cyan/85 focus-visible:ring-brand-cyan/50 border-transparent',
  ghost:
    'bg-transparent text-ink hover:bg-gray-100 focus-visible:ring-gray-300 border-gray-200',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 border-transparent',
  outline:
    'bg-transparent text-magenta hover:bg-magenta hover:text-white focus-visible:ring-magenta/30 border-magenta',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg border',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
