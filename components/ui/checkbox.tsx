import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
}

export function Checkbox({ label, helper, id, className, ...props }: CheckboxProps) {
  const checkId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex items-start gap-2.5">
      <input
        type="checkbox"
        id={checkId}
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-magenta',
          'focus:ring-2 focus:ring-magenta/30 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'accent-magenta',
          className,
        )}
        {...props}
      />
      {(label || helper) && (
        <div className="flex flex-col">
          {label && (
            <label htmlFor={checkId} className="text-sm font-medium text-ink cursor-pointer">
              {label}
            </label>
          )}
          {helper && <p className="text-xs text-gray-400">{helper}</p>}
        </div>
      )}
    </div>
  )
}
