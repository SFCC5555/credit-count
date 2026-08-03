'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogRideModal } from '@/components/log-ride-modal'
import { EmptyState } from '@/components/ui/empty-state'
import { type Coaster } from '@/lib/types'

type RidesFilter = 'all' | 'ridden' | 'not-ridden'

const baseClass =
  'rounded-lg border border-gray-200 bg-white py-2 text-sm transition-colors hover:border-magenta focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-magenta/20 focus:border-magenta'
const active = (on: boolean) => on ? 'text-magenta' : 'text-ink'

export function CoasterList({
  coasters,
  rideCounts,
}: {
  coasters: Coaster[]
  rideCounts: Record<string, number>
}) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [manufacturerFilter, setManufacturerFilter] = useState('')
  const [ridesFilter, setRidesFilter] = useState<RidesFilter>('all')
  const [logTarget, setLogTarget] = useState<Coaster | null>(null)

  const types = useMemo(
    () => Array.from(new Set(coasters.map(c => c.type))).sort(),
    [coasters],
  )
  const manufacturers = useMemo(
    () => Array.from(new Set(coasters.map(c => c.manufacturer))).sort(),
    [coasters],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return coasters.filter(c => {
      if (q && !c.name.toLowerCase().includes(q) && !c.park.toLowerCase().includes(q) && !c.country.toLowerCase().includes(q)) return false
      if (typeFilter && c.type !== typeFilter) return false
      if (manufacturerFilter && c.manufacturer !== manufacturerFilter) return false
      const count = rideCounts[c.id] ?? 0
      if (ridesFilter === 'ridden' && count === 0) return false
      if (ridesFilter === 'not-ridden' && count > 0) return false
      return true
    })
  }, [coasters, query, typeFilter, manufacturerFilter, ridesFilter, rideCounts])

  const hasActiveFilters = query || typeFilter || manufacturerFilter || ridesFilter !== 'all'

  return (
    <>
      <p className="text-sm text-gray-400 mb-3">
        {filtered.length} {filtered.length === 1 ? 'coaster' : 'coasters'} shown
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {/* Search */}
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
            className={`w-full ${baseClass} pl-9 pr-3 ${active(!!query)}`}
          />
        </div>

        {/* Type */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className={`${baseClass} pl-3 pr-8 ${active(!!typeFilter)}`}
        >
          <option value="">All types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Manufacturer */}
        <select
          value={manufacturerFilter}
          onChange={e => setManufacturerFilter(e.target.value)}
          className={`${baseClass} pl-3 pr-8 ${active(!!manufacturerFilter)}`}
        >
          <option value="">All manufacturers</option>
          {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* My rides */}
        <select
          value={ridesFilter}
          onChange={e => setRidesFilter(e.target.value as RidesFilter)}
          className={`${baseClass} pl-3 pr-8 ${active(ridesFilter !== 'all')}`}
        >
          <option value="all">All coasters</option>
          <option value="ridden">Ridden</option>
          <option value="not-ridden">Not ridden</option>
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setQuery('')
              setTypeFilter('')
              setManufacturerFilter('')
              setRidesFilter('all')
            }}
            className={`${baseClass} px-3 flex items-center gap-1.5 text-magenta/50 hover:text-magenta border-magenta/30 hover:border-magenta`}
          >
            <svg className="h-2.5 w-2.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
          }
          title="No coasters found"
          description="Try adjusting your search or filters."
        />
      ) : (
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
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-gray-400">My rides</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((coaster, i) => {
                const count = rideCounts[coaster.id] ?? 0
                return (
                  <tr key={coaster.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-300 tabular-nums text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{coaster.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{coaster.park}</td>
                    <td className="px-4 py-3 text-gray-500">{coaster.country}</td>
                    <td className="px-4 py-3">
                      <Badge variant="gray">{coaster.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{coaster.manufacturer}</td>
                    <td className="px-4 py-3 text-center">
                      {count > 0 ? (
                        <span className="font-display font-bold text-magenta tabular-nums">{count}</span>
                      ) : (
                        <span className="text-gray-200">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2.5 py-1 breathe-on-row-hover"
                        onClick={() => setLogTarget(coaster)}
                      >
                        Log
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {logTarget && (
        <LogRideModal
          coaster={logTarget}
          open={true}
          onClose={() => setLogTarget(null)}
        />
      )}
    </>
  )
}
