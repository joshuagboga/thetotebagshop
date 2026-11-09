import { useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import FeatureSection from '../components/FeatureSection.jsx'
import { EmptyState, ErrorMessage, Loading } from '../components/Status.jsx'
import { useDebounced, useProductList } from '../useProducts.js'

export default function HomePage({ query }) {
  const [category, setCategory] = useState('All')
  const search = useDebounced(query)
  const list = useProductList({ search, category: category === 'All' ? '' : category, limit: 12 })
  const filtered = search.trim() || category !== 'All'

  return (
    <main className="space-y-16 pb-24">
      <div className="px-4">
        <CategoryFilter active={category} onSelect={setCategory} />
      </div>

      <HeroBanner />

      <ProductGrid
        id="shop"
        title={filtered ? 'Search results' : 'Available Stock'}
        subtitle={
          list.pagination && list.status !== 'loading' && (filtered || list.pagination.total > 0)
            ? `${list.pagination.total} totebag${list.pagination.total === 1 ? '' : 's'}${
                category !== 'All' ? ` in ${category}` : ''
              }${search.trim() ? ` matching “${search.trim()}”` : ''}`
            : 'These totebags are currently available for sales'
        }
        products={list.status === 'loading' ? [] : list.products}
      >
        {list.status === 'loading' && <Loading label="Loading totebags…" />}

        {list.status === 'error' && <ErrorMessage className="mt-6" message={list.error} onRetry={list.retry} />}

        {list.status === 'ready' && list.products.length === 0 && (
          <EmptyState className="mt-6" title={filtered ? 'No totebags match your search.' : 'New totebags are on the way.'}>
            <p className="mt-1 text-sm text-neutral-600">
              {filtered ? 'Try another word or category.' : 'Check back soon — our shelves are being restocked.'}
            </p>
            {filtered && (
              <button
                type="button"
                onClick={() => setCategory('All')}
                className="mt-6 rounded-md bg-pine px-6 py-3 text-sm text-white hover:bg-pine/80"
              >
                Show all categories
              </button>
            )}
          </EmptyState>
        )}

        {(list.hasMore || list.status === 'loadingMore') && list.status !== 'error' && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={list.loadMore}
              disabled={list.status === 'loadingMore'}
              className="rounded-md border border-neutral-400 bg-white px-8 py-3 text-sm hover:bg-neutral-50 disabled:opacity-60"
            >
              {list.status === 'loadingMore' ? 'Loading…' : 'Load more totebags'}
            </button>
          </div>
        )}
      </ProductGrid>

      <FeatureSection />
    </main>
  )
}
