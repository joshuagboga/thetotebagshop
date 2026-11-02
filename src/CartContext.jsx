import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_DELIVERY_FEE, closures, getProduct, locations } from './data/products.js'

const STORAGE_KEY = 'thetotebagshop:cart'
const CartContext = createContext(null)

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [saved] = useState(load)
  const [items, setItems] = useState(saved.items ?? [])
  const [location, setLocation] = useState(saved.location ?? '')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, location }))
    } catch {
      // Storage can be unavailable (private mode); the cart still works in memory.
    }
  }, [items, location])

  const addItem = ({ productId, color, closure, quantity }) => {
    const key = `${productId}-${color}-${closure}`
    setItems((current) =>
      current.some((item) => item.key === key)
        ? current.map((item) => (item.key === key ? { ...item, quantity: item.quantity + quantity } : item))
        : [...current, { key, productId, color, closure, quantity }],
    )
  }

  const updateQuantity = (key, quantity) =>
    setItems((current) => current.map((item) => (item.key === key ? { ...item, quantity } : item)))

  const removeItem = (key) => setItems((current) => current.filter((item) => item.key !== key))

  const clear = () => setItems([])

  // Drop anything whose product no longer exists in the catalogue.
  const lines = items
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((line) => line.product)

  const closureCost = (label) => closures.find((c) => c.label === label)?.cost ?? 0
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const extras = lines.reduce((sum, line) => sum + closureCost(line.closure) * line.quantity, 0)
  const deliveryFee = locations.find((l) => l.label === location)?.fee ?? DEFAULT_DELIVERY_FEE
  const delivery = lines.length ? deliveryFee : 0

  const value = {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    location,
    setLocation,
    deliveryFee,
    totals: { subtotal, extras, delivery, total: subtotal + extras + delivery },
    addItem,
    updateQuantity,
    removeItem,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
