'use client'

import { useEffect, useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logRide } from '@/app/actions/rides'
import { localDateString } from '@/lib/utils'
import { type Coaster } from '@/lib/types'

interface LogRideModalProps {
  coaster: Coaster
  open: boolean
  onClose: () => void
}

const today = () => localDateString()

export function LogRideModal({ coaster, open, onClose }: LogRideModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) setError(null)
  }, [open])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('coaster_id', coaster.id)
    setError(null)
    startTransition(async () => {
      const result = await logRide(undefined, formData)
      if (result && 'error' in result) setError(result.error)
      else onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Log a ride">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coaster — read only */}
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
          <p className="text-sm font-medium text-ink">{coaster.name}</p>
          <p className="text-xs text-gray-400">{coaster.park} · {coaster.country}</p>
        </div>

        <Input
          label="Date"
          name="ride_date"
          type="date"
          required
          defaultValue={today()}
          max={today()}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">
            Note <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            name="note"
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta transition-colors resize-none"
            placeholder="Any thoughts about this ride?"
          />
        </div>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isPending}>
            Log ride
          </Button>
        </div>
      </form>
    </Modal>
  )
}
