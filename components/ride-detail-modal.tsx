'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { deleteRide } from '@/app/actions/rides'
import { type RideWithCoaster } from '@/lib/types'

interface RideDetailModalProps {
  ride: RideWithCoaster | null
  open: boolean
  onClose: () => void
  onEdit: (ride: RideWithCoaster) => void
}

export function RideDetailModal({ ride, open, onClose, onEdit }: RideDetailModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!ride) return null

  function handleDelete() {
    startTransition(async () => {
      await deleteRide(ride!.id)
      onClose()
    })
  }

  function handleEdit() {
    onClose()
    onEdit(ride!)
  }

  return (
    <Modal open={open} onClose={onClose} title={ride.coasters.name}>
      <div className="space-y-5">
        <p className="text-sm text-gray-400 -mt-2">{ride.coasters.park}</p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Country" value={ride.coasters.country} />
          <Field label="Date" value={formatDate(ride.ride_date)} />
          <Field label="Type" value={ride.coasters.type} />
          <Field label="Manufacturer" value={ride.coasters.manufacturer} />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1.5">Note</p>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 min-h-[60px]">
            {ride.note ? (
              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{ride.note}</p>
            ) : (
              <p className="text-sm text-gray-300 italic">No note</p>
            )}
          </div>
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
            <p className="text-sm text-gray-500 flex-1">Delete this ride?</p>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={isPending} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 pt-1 border-t border-gray-100">
            <Button
              variant="ghost"
              className="flex-1 text-red-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-ink">{value}</p>
    </div>
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
