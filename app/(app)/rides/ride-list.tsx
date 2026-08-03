'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EditRideModal } from '@/components/edit-ride-modal'
import { RideDetailModal } from '@/components/ride-detail-modal'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { deleteRide } from '@/app/actions/rides'
import { type RideWithCoaster } from '@/lib/types'

export function RideList({ rides }: { rides: RideWithCoaster[] }) {
  const [detailRide, setDetailRide] = useState<RideWithCoaster | null>(null)
  const [editRide, setEditRide] = useState<RideWithCoaster | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleDelete(rideId: string) {
    startTransition(async () => {
      const result = await deleteRide(rideId)
      setConfirmId(null)
      if (result && 'error' in result) toast(result.error, 'error')
      else toast('Ride deleted.', 'success')
    })
  }

  if (rides.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        }
        title="No rides yet"
        description="Start logging rides to build your history."
        action={
          <Link
            href="/catalog"
            className="animate-breathe-shadow inline-flex items-center justify-center font-medium rounded-lg border border-transparent bg-magenta text-white text-sm px-4 py-2 hover:bg-magenta/85 transition-colors"
          >
            Log your first ride
          </Link>
        }
      />
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-gray-400 w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Coaster</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Manufacturer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-400">Note</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rides.map((ride, i) => (
              <tr
                key={ride.id}
                className="cursor-pointer hover:bg-magenta/[0.06] transition-colors"
                onClick={() => setDetailRide(ride)}
              >
                <td className="px-4 py-3 text-center text-gray-300 tabular-nums text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{ride.coasters.name}</p>
                  <p className="text-xs text-gray-400">{ride.coasters.park}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">{ride.coasters.country}</td>
                <td className="px-4 py-3 text-gray-500">{ride.coasters.type}</td>
                <td className="px-4 py-3 text-gray-500">{ride.coasters.manufacturer}</td>
                <td className="px-4 py-3 text-gray-500 tabular-nums whitespace-nowrap">
                  {formatDate(ride.ride_date)}
                </td>
                <td className="px-4 py-3 text-gray-400 max-w-[160px] truncate">
                  {ride.note ?? <span className="text-gray-200">—</span>}
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    {confirmId === ride.id ? (
                      <>
                        <span className="text-xs text-gray-500 mr-1">Delete?</span>
                        <Button size="sm" variant="danger" loading={isPending} onClick={() => handleDelete(ride.id)}>
                          Yes
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                          No
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => setEditRide(ride)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmId(ride.id)}
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

      <RideDetailModal
        ride={detailRide}
        open={detailRide !== null}
        onClose={() => setDetailRide(null)}
        onEdit={ride => setEditRide(ride)}
      />
      <EditRideModal ride={editRide} open={editRide !== null} onClose={() => setEditRide(null)} />
    </>
  )
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
