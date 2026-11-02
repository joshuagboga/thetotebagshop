import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import SearchBar from './components/SearchBar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import { CartProvider } from './CartContext.jsx'
import { navigate, useRoute } from './useRoute.js'

export default function App() {
  const { hash, page, id } = useRoute()
  const [query, setQuery] = useState('')

  // The browser can't scroll to "#shop" while another page is rendered, so
  // scroll once the new page is in the DOM; real pages start at the top.
  useEffect(() => {
    const target = page === 'home' && hash.length > 1 && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash, page])

  // Searching from a product or the cart takes you back to the results.
  const search = (value) => {
    setQuery(value)
    if (page !== 'home') navigate('shop')
  }

  return (
    <CartProvider>
      <Navbar />

      <div className="px-4 pt-6 pb-7">
        <SearchBar value={query} onChange={search} />
      </div>

      {page === 'product' ? (
        <ProductPage key={id} id={id} />
      ) : page === 'cart' ? (
        <CartPage />
      ) : (
        <HomePage query={query} />
      )}

      <Footer />
    </CartProvider>
  )
}
