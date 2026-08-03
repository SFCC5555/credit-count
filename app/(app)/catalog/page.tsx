import { Container } from '@/components/container'
import { EmptyState } from '@/components/ui/empty-state'

export default function CatalogPage() {
  return (
    <main className="flex-1 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink">Catalogue</h1>
          <p className="text-sm text-gray-400 mt-1">Browse the coaster catalogue.</p>
        </div>
        <EmptyState
          icon={
            <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          }
          title="Catalogue coming in Step 7"
          description="You'll be able to browse and search all coasters here."
        />
      </Container>
    </main>
  )
}
