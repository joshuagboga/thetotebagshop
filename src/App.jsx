import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import SearchBar from './components/SearchBar.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import HeroBanner from './components/HeroBanner.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import FeatureSection from './components/FeatureSection.jsx'
import Footer from './components/Footer.jsx'
import { availableStock, moreStock, otherStock } from './data/products.js'

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const matches = (products) => {
    const q = query.trim().toLowerCase()
    return q ? products.filter((p) => p.alt.toLowerCase().includes(q)) : products
  }

  return (
    <>
      <Navbar />

      <main className="space-y-16 pb-24">
        <div className="space-y-7 px-4 pt-6">
          <SearchBar value={query} onChange={setQuery} />
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

      <Footer />
    </>
  )
}
