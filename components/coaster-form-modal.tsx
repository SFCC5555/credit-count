'use client'

import { useEffect, useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { createCoaster, updateCoaster } from '@/app/actions/coasters'
import { type Coaster } from '@/lib/types'

interface CoasterFormModalProps {
  coaster?: Coaster
  coasters: Coaster[]
  open: boolean
  onClose: () => void
}

const fieldClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 hover:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-colors'

function Field({ label, name, value, onChange, placeholder, required = true }: {
  label: string
  name: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={fieldClass}
      />
    </div>
  )
}

export function CoasterFormModal({ coaster, coasters, open, onClose }: CoasterFormModalProps) {
  const isEdit = !!coaster
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [park, setPark] = useState('')

  useEffect(() => {
    if (open) {
      setError(null)
      setName(coaster?.name ?? '')
      setPark(coaster?.park ?? '')
    }
  }, [open, coaster])

  const formKey = open ? (coaster?.id ?? 'create') : 'closed'

  const exactDuplicates = name.trim() && park.trim()
    ? coasters.filter(c =>
        (isEdit ? c.id !== coaster!.id : true) &&
        c.name.toLowerCase() === name.trim().toLowerCase() &&
        c.park.toLowerCase() === park.trim().toLowerCase()
      )
    : []

  const similarNames = !exactDuplicates.length && name.trim().length >= 3
    ? coasters.filter(c =>
        (isEdit ? c.id !== coaster!.id : true) &&
        c.name.toLowerCase().includes(name.trim().toLowerCase())
      ).slice(0, 3)
    : []

  const types         = [...new Set(coasters.map(c => c.type))].sort()
  const manufacturers = [...new Set(coasters.map(c => c.manufacturer))].sort()
  const countries     = [...new Set(coasters.map(c => c.country))].sort()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (isEdit) formData.set('coaster_id', coaster!.id)
    setError(null)
    startTransition(async () => {
      const result = await (isEdit ? updateCoaster : createCoaster)(undefined, formData)
      if (result && 'error' in result) setError(result.error)
      else {
        toast(isEdit ? 'Coaster updated.' : 'Coaster added to the catalogue.', 'success')
        onClose()
      }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit coaster' : 'Add coaster'}>
      <form key={formKey} onSubmit={handleSubmit} className="space-y-4">

        {exactDuplicates.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-sm font-medium text-red-600">Duplicate detected</p>
            <p className="text-xs text-red-500 mt-0.5">
              {exactDuplicates.map(d => `${d.name} — ${d.park}`).join(', ')} already exists.
            </p>
          </div>
        )}

        {similarNames.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
            <p className="text-sm font-medium text-amber-600">Similar names found</p>
            <p className="text-xs text-amber-500 mt-0.5">
              {similarNames.map(d => `${d.name} (${d.park})`).join(', ')}
            </p>
          </div>
        )}

        <Field label="Name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fury 325" />
        <Field label="Park" name="park" value={park} onChange={e => setPark(e.target.value)} placeholder="e.g. Carowinds" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">Country</label>
          <input name="country" required list="cl-countries" defaultValue={coaster?.country ?? ''} placeholder="e.g. United States" className={fieldClass} />
          <datalist id="cl-countries">{countries.map(c => <option key={c} value={c} />)}</datalist>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">Type</label>
          <input name="type" required list="cl-types" defaultValue={coaster?.type ?? ''} placeholder="e.g. Steel" className={fieldClass} />
          <datalist id="cl-types">{types.map(t => <option key={t} value={t} />)}</datalist>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">Manufacturer</label>
          <input name="manufacturer" required list="cl-manufacturers" defaultValue={coaster?.manufacturer ?? ''} placeholder="e.g. B&M" className={fieldClass} />
          <datalist id="cl-manufacturers">{manufacturers.map(m => <option key={m} value={m} />)}</datalist>
        </div>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" className="flex-1" loading={isPending}>
            {isEdit ? 'Save changes' : 'Add coaster'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
