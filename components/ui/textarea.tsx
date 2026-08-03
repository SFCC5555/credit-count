import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
}

export function Textarea({ label, error, helper, id, className, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={3}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400',
          'resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
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
