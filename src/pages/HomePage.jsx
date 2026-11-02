import { useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import FeatureSection from '../components/FeatureSection.jsx'
import { availableStock, moreStock, otherStock } from '../data/products.js'

export default function HomePage({ query }) {
  const [category, setCategory] = useState('All')

  const matches = (products) => {
    const q = query.trim().toLowerCase()
    return q ? products.filter((p) => p.alt.toLowerCase().includes(q)) : products
  }

  return (
    <main className="space-y-16 pb-24">
      <div className="px-4">
        <CategoryFilter active={category} onSelect={setCategory} />
      </div>

      <HeroBanner />

      <ProductGrid
        id="shop"
        title="Available Stock"
        subtitle="These totebags are currently available for sales"
        products={matches(availableStock)}
      />
      <ProductGrid
        title="Other Stock"
        subtitle="These totebags are currently available for sales"
        products={matches(otherStock)}
      />

      <FeatureSection />

      <ProductGrid products={matches(moreStock)} />
    </main>
  )
}
