import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export function Input({ label, error, helper, id, className, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-400 focus:ring-red-300'
            : 'border-gray-200 focus:border-magenta focus:ring-magenta/20',
          'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helper && !error && <p className="text-xs text-gray-400">{helper}</p>}
    </div>
  )
}
