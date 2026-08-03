import { cn } from '@/lib/utils'

export function Table({
  children,
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table
        className={cn('w-full text-sm text-ink border-collapse', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

export function TableHead({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100',
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('divide-y divide-gray-50 bg-white', className)}
      {...props}
    >
      {children}
    </tbody>
  )
}

export function TableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('hover:bg-gray-50/60 transition-colors', className)}
      {...props}
    >
      {children}
    </tr>
  )
}

export function Th({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('px-4 py-3 text-left font-medium', className)} {...props}>
      {children}
    </th>
  )
}

export function Td({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3', className)} {...props}>
      {children}
    </td>
  )
}
