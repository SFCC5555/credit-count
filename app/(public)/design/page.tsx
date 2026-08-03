'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Container } from '@/components/container'
import {
  Button, Input, Textarea, Select, Checkbox,
  Card, CardHeader, CardBody, TearLine,
  Badge, CoasterTypeBadge,
  Modal,
  Table, TableHead, TableBody, TableRow, Th, Td,
  EmptyState, Spinner, Skeleton, SkeletonCard, SkeletonRow,
  ToastProvider, useToast,
} from '@/components/ui'

/* ── Inner content (needs useToast context) ── */
function DesignContent() {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  return (
    <div className="py-10 space-y-16">

      {/* ── Typography ── */}
      <section className="space-y-4">
        <SectionLabel>Typography</SectionLabel>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-ink">
          127 Credits
        </h1>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Ride History
        </h2>
        <h3 className="font-display text-xl font-semibold text-ink">
          Cedar Point — United States
        </h3>
        <p className="text-sm text-gray-600 max-w-prose">
          Body text: Log every coaster you have ever ridden. Your credits update instantly, no manual refresh needed. This is the utility text style used in forms, tables, and descriptions throughout the app.
        </p>
        <p className="text-xs text-gray-400">
          Micro / helper text — used for error messages, timestamps, and field hints.
        </p>
      </section>

      {/* ── Colors ── */}
      <section className="space-y-3">
        <SectionLabel>Colors</SectionLabel>
        <div className="flex flex-wrap gap-3">
          <Swatch bg="bg-magenta" label="Magenta #FF3E9D" textClass="text-white" />
          <Swatch bg="bg-brand-cyan" label="Cyan #00BCD4" textClass="text-white" />
          <Swatch bg="bg-paper border border-gray-200" label="Paper #FFFBF2" textClass="text-ink" />
          <Swatch bg="bg-ink" label="Ink #1A1A1A" textClass="text-white" />
          <Swatch bg="bg-gray-100 border border-gray-200" label="Gray 100" textClass="text-gray-600" />
          <Swatch bg="bg-gray-200" label="Gray 200" textClass="text-gray-700" />
          <Swatch bg="bg-gray-400" label="Gray 400" textClass="text-white" />
        </div>
      </section>

      {/* ── Buttons ── */}
      <section className="space-y-4">
        <SectionLabel>Buttons</SectionLabel>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Log a ride</Button>
          <Button variant="secondary">Browse catalogue</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" loading>Saving…</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => toast('Ride logged successfully!', 'success')}>
            Trigger success toast
          </Button>
          <Button variant="ghost" onClick={() => toast('Something went wrong.', 'error')}>
            Trigger error toast
          </Button>
          <Button variant="ghost" onClick={() => toast('Info: your session will expire soon.', 'info')}>
            Info toast
          </Button>
        </div>
      </section>

      {/* ── Forms ── */}
      <section className="space-y-5">
        <SectionLabel>Form Elements</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <Input
            label="Display name"
            placeholder="KoinEnthusiast"
            helper="Your public name on the leaderboard."
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            error="That email is already in use."
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Note"
              placeholder="Optional note about this ride…"
              helper="Markdown not supported."
            />
          </div>
          <Select
            label="Coaster type"
            placeholder="Select type…"
            options={[
              { value: 'Steel',  label: 'Steel' },
              { value: 'Wooden', label: 'Wooden' },
              { value: 'Hybrid', label: 'Hybrid' },
            ]}
          />
          <div className="flex items-end pb-2">
            <Checkbox
              label="Show on leaderboard"
              helper="Others can see your credit count."
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          </div>
        </div>
      </section>

      {/* ── Card + TearLine ── */}
      <section className="space-y-4">
        <SectionLabel>Card — with Ticket Tear Line</SectionLabel>
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
          {/* Stat card with tear line */}
          <Card>
            <CardHeader>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                Credits
              </p>
            </CardHeader>
            <TearLine />
            <CardBody>
              <p className="font-display text-4xl font-extrabold text-magenta leading-none">
                127
              </p>
              <p className="text-xs text-gray-400 mt-1">unique coasters</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                Total Rides
              </p>
            </CardHeader>
            <TearLine />
            <CardBody>
              <p className="font-display text-4xl font-extrabold text-ink leading-none">
                203
              </p>
              <p className="text-xs text-gray-400 mt-1">all time</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                Countries
              </p>
            </CardHeader>
            <TearLine />
            <CardBody>
              <p className="font-display text-4xl font-extrabold text-brand-cyan leading-none">
                8
              </p>
              <p className="text-xs text-gray-400 mt-1">visited</p>
            </CardBody>
          </Card>
        </div>

        {/* Plain card */}
        <Card className="max-w-sm p-5">
          <p className="text-sm text-gray-600">
            Plain card — no tear line. Used for forms and secondary content.
          </p>
        </Card>
      </section>

      {/* ── Badges ── */}
      <section className="space-y-3">
        <SectionLabel>Badges</SectionLabel>
        <div className="flex flex-wrap gap-2">
          <CoasterTypeBadge type="Steel" />
          <CoasterTypeBadge type="Wooden" />
          <CoasterTypeBadge type="Hybrid" />
          <Badge variant="magenta">New</Badge>
          <Badge variant="cyan">Admin</Badge>
          <Badge variant="gray">Archived</Badge>
        </div>
      </section>

      {/* ── Table ── */}
      <section className="space-y-3">
        <SectionLabel>Table</SectionLabel>
        <Table>
          <TableHead>
            <TableRow>
              <Th>#</Th>
              <Th>Coaster</Th>
              <Th>Park</Th>
              <Th>Type</Th>
              <Th>Date</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { n: 1, name: 'Millennium Force', park: 'Cedar Point',           type: 'Steel',  date: '2026-07-12' },
              { n: 2, name: 'El Toro',          park: 'Six Flags Great Adventure', type: 'Wooden', date: '2025-08-03' },
              { n: 3, name: 'Wildfire',         park: 'Kolmården Wildlife Park', type: 'Hybrid', date: '2025-06-21' },
            ].map((row) => (
              <TableRow key={row.n}>
                <Td className="text-gray-400">{row.n}</Td>
                <Td className="font-medium">{row.name}</Td>
                <Td className="text-gray-500">{row.park}</Td>
                <Td><CoasterTypeBadge type={row.type} /></Td>
                <Td className="text-gray-400 tabular-nums">{row.date}</Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* ── Empty State ── */}
      <section className="space-y-3">
        <SectionLabel>Empty State</SectionLabel>
        <Card>
          <EmptyState
            icon={
              <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
            title="No rides logged yet"
            description="Start by logging the first coaster you've ridden. It only takes a few seconds."
            action={<Button variant="primary" size="sm">Log first ride</Button>}
          />
        </Card>
      </section>

      {/* ── Loading ── */}
      <section className="space-y-5">
        <SectionLabel>Loading States</SectionLabel>
        <div className="flex items-center gap-4">
          <Spinner size="sm" className="text-magenta" />
          <Spinner size="md" className="text-brand-cyan" />
          <Spinner size="lg" className="text-gray-400" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Card className="divide-y divide-gray-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4">
              <SkeletonRow />
            </div>
          ))}
        </Card>
        <div className="space-y-2 max-w-xs">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </section>

      {/* ── Modal ── */}
      <section className="space-y-3">
        <SectionLabel>Modal</SectionLabel>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Log a Ride"
        >
          <div className="space-y-4">
            <Input label="Coaster" placeholder="Search for a coaster…" />
            <Input label="Date" type="date" />
            <Textarea label="Note" placeholder="Optional note…" />
            <div className="flex gap-2 pt-1">
              <Button
                variant="primary"
                onClick={() => {
                  setModalOpen(false)
                  toast('Ride logged!', 'success')
                }}
              >
                Save
              </Button>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </section>

    </div>
  )
}

/* ── Helpers ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <h2 className="font-display text-sm font-bold uppercase tracking-widest text-gray-400">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

function Swatch({
  bg, label, textClass,
}: {
  bg: string; label: string; textClass: string
}) {
  return (
    <div className={`rounded-lg px-4 py-3 min-w-[120px] ${bg}`}>
      <p className={`text-xs font-medium ${textClass}`}>{label}</p>
    </div>
  )
}

/* ── Page ── */
export default function DesignPage() {
  return (
    <ToastProvider>
      <Navbar />
      <main className="flex-1">
        <Container>
          <div className="pt-8 pb-4 border-b border-gray-100 mb-2">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">
              Design System Preview
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Credit Count — Step 5 component library · <span className="text-magenta">magenta</span> + <span className="text-brand-cyan">cyan</span> + paper
            </p>
          </div>
          <DesignContent />
        </Container>
      </main>
    </ToastProvider>
  )
}
