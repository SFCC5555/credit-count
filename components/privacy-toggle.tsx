'use client'

import { useState, useTransition } from 'react'
import { updatePrivacy } from '@/app/actions/rides'
import { useToast } from '@/components/ui/toast'

export function PrivacyToggle({ isPrivate }: { isPrivate: boolean }) {
  const [showOnBoard, setShowOnBoard] = useState(!isPrivate)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function toggle() {
    const next = !showOnBoard
    setShowOnBoard(next)
    startTransition(async () => {
      const result = await updatePrivacy(!next)
      if (result && 'error' in result) {
        setShowOnBoard(!next)
        toast(result.error, 'error')
      } else {
        toast(next ? 'Now public — you\'re on the leaderboard.' : 'Now private — hidden from the leaderboard.', 'success')
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={showOnBoard}
        disabled={isPending}
        onClick={toggle}
        className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-magenta/30 disabled:opacity-50"
        style={{ backgroundColor: showOnBoard ? 'var(--color-magenta)' : '#D1D5DB' }}
      >
        <span
          className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: showOnBoard ? 'translateX(20px)' : 'translateX(0px)' }}
        />
      </button>
      <span className="text-sm text-gray-600">
        {showOnBoard ? 'Public — visible on the leaderboard' : 'Private — not on the leaderboard'}
      </span>
    </div>
  )
}
