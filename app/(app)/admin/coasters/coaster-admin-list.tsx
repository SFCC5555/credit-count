'use client'

import { useState, useMemo, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CoasterFormModal } from '@/components/coaster-form-modal'
import { useToast } from '@/components/ui/toast'
import { deleteCoaster } from '@/app/actions/coasters'
import { type Coaster } from '@/lib/types'

const baseClass =
  'rounded-lg border border-gray-200 bg-white py-2 text-sm transition-colors hover:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-cyan/20 focus:border-brand-cyan'
const active = (on: boolean) => on ? 'text-brand-cyan' : 'text-ink'

export function CoasterAdminList({ coasters }: { coasters: Coaster[] }) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Coaster | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [manufacturerFilter, setManufacturerFilter] = useState('')

  const types         = useMemo(() => [...new Set(coasters.map(c => c.type))].sort(), [coasters])
  const manufacturers = useMemo(() => [...new Set(coasters.map(c => c.manufacturer))].sort(), [coasters])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return coasters.filter(c => {
      if (q && !c.name.toLowerCase().includes(q) && !c.park.toLowerCase().includes(q) && !c.country.toLowerCase().includes(q)) return false
      if (typeFilter && c.type !== typeFilter) return false
      if (manufacturerFilter && c.manufacturer !== manufacturerFilter) return false
      return true
    })
  }, [coasters, query, typeFilter, manufacturerFilter])

  const hasActiveFilters = query || typeFilter || manufacturerFilter

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCoaster(id)
      setConfirmId(null)
      if (result && 'error' in result) {
        if (result.error === 'fk_violation') {
          toast("Can't delete — this coaster has ride history. Edit it instead if you need to fix details.", 'error')
        } else {
          toast(result.error ?? 'Something went wrong.', 'error')
        }
      } else {
        toast('Coaster deleted.', 'success')
      }
    })
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          {filtered.length} of {coasters.length} coaster{coasters.length !== 1 ? 's' : ''}
        </p>
        <Button variant="secondary" className="animate-breathe-shadow-cyan shrink-0" onClick={() => setCreateOpen(true)}>
          + Add coaster
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, park, or country…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={`w-full pl-9 pr-3 ${baseClass} ${active(!!query)}`}
          />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className={`${baseClass} pl-3 pr-8 ${active(!!typeFilter)}`}
        >
          <option value="">All types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={manufacturerFilter}
          onChange={e => setManufacturerFilter(e.target.value)}
          className={`${baseClass} pl-3 pr-8 ${active(!!manufacturerFilter)}`}
        >
          <option value="">All manufacturers</option>
          {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => { setQuery(''); setTypeFilter(''); setManufacturerFilter('') }}
            className={`${baseClass} px-3 flex items-center gap-1.5 text-brand-cyan/50 hover:text-brand-cyan border-brand-cyan/30 hover:border-brand-cyan`}
          >
            <svg className="h-2.5 w-2.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-gray-400 w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Park</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Manufacturer</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  {hasActiveFilters ? 'No coasters match your filters.' : 'No coasters yet. Add the first one.'}
                </td>
              </tr>
            ) : filtered.map((coaster, i) => (
              <tr key={coaster.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3 text-center text-gray-300 tabular-nums text-xs">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-ink">{coaster.name}</td>
                <td className="px-4 py-3 text-gray-500">{coaster.park}</td>
                <td className="px-4 py-3 text-gray-500">{coaster.country}</td>
                <td className="px-4 py-3"><Badge variant="gray">{coaster.type}</Badge></td>
                <td className="px-4 py-3 text-gray-500">{coaster.manufacturer}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {confirmId === coaster.id ? (
                      <>
                        <span className="text-xs text-gray-500 mr-1">Delete?</span>
                        <Button size="sm" variant="danger" loading={isPending} onClick={() => handleDelete(coaster.id)}>
                          Yes
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                          No
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" className="breathe-on-row-hover-cyan" onClick={() => setEditTarget(coaster)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmId(coaster.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CoasterFormModal
        coasters={coasters}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <CoasterFormModal
        coaster={editTarget ?? undefined}
        coasters={coasters}
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
      />
    </>
  )
}
