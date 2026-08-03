'use client'

import { useEffect, useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateRide } from '@/app/actions/rides'
import { localDateString } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { type RideWithCoaster } from '@/lib/types'

interface EditRideModalProps {
  ride: RideWithCoaster | null
  open: boolean
  onClose: () => void
}

export function EditRideModal({ ride, open, onClose }: EditRideModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) setError(null)
  }, [open])

  if (!ride) return null

  const today = localDateString()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('ride_id', ride!.id)
    setError(null)
    startTransition(async () => {
      const result = await updateRide(undefined, formData)
      if (result && 'error' in result) setError(result.error ?? 'Something went wrong.')
      else {
        toast('Ride updated.', 'success')
        onClose()
      }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit ride">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coaster — read only */}
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
          <p className="text-sm font-medium text-ink">{ride.coasters.name}</p>
          <p className="text-xs text-gray-400">{ride.coasters.park} · {ride.coasters.country}</p>
        </div>

        <Input
          label="Date"
          name="ride_date"
          type="date"
          required
          defaultValue={ride.ride_date}
          max={today}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">
            Note <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            name="note"
            rows={2}
            key={ride.id}
            defaultValue={ride.note ?? ''}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 hover:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-colors resize-none"
            placeholder="Any thoughts about this ride?"
          />
        </div>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
