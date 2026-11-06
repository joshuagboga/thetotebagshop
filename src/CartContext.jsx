import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_DELIVERY_FEE, closures, locations } from './data/options.js'
import { api } from './api.js'

const STORAGE_KEY = 'thetotebagshop:cart'
const CartContext = createContext(null)

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

// Only what the cart needs to render; the server re-prices everything at checkout.
const snapshot = ({ id, name, price, image, stock, status, category }) => ({
  id,
  name,
  price: Number(price),
  image,
  stock,
  status,
  category,
})

export function CartProvider({ children }) {
  const [saved] = useState(load)
  // Carts saved before the shop used the API have no product snapshot; drop them.
  const [items, setItems] = useState(() => (saved.items ?? []).filter((item) => item.product?.id))
  const [location, setLocation] = useState(saved.location ?? '')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, location }))
    } catch {
      // Storage can be unavailable (private mode); the cart still works in memory.
    }
  }, [items, location])

  const addItem = ({ product, color, closure, quantity }) => {
    const key = `${product.id}-${color}-${closure}`
    setItems((current) =>
      current.some((item) => item.key === key)
        ? current.map((item) =>
            item.key === key ? { ...item, product: snapshot(product), quantity: item.quantity + quantity } : item,
          )
        : [...current, { key, productId: product.id, product: snapshot(product), color, closure, quantity }],
    )
  }

  const updateQuantity = (key, quantity) =>
    setItems((current) => current.map((item) => (item.key === key ? { ...item, quantity } : item)))

  const removeItem = (key) => setItems((current) => current.filter((item) => item.key !== key))

  const clear = () => setItems([])

  // Refresh prices and stock from the server; drop products that were deleted.
  const sync = async () => {
    const ids = [...new Set(items.map((item) => item.productId))]
    if (!ids.length) return
    const results = await Promise.all(
      ids.map((id) =>
        api
          .getProduct(id)
          .then((res) => [id, res.data])
          .catch((err) => [id, err.status === 404 ? null : undefined]),
      ),
    )
    const fresh = Object.fromEntries(results)
    setItems((current) =>
      current
        .filter((item) => fresh[item.productId] !== null)
        .map((item) => (fresh[item.productId] ? { ...item, product: snapshot(fresh[item.productId]) } : item)),
    )
  }

  const lines = items

  const closureCost = (label) => closures.find((c) => c.label === label)?.cost ?? 0
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const extras = lines.reduce((sum, line) => sum + closureCost(line.closure) * line.quantity, 0)
  const deliveryFee = locations.find((l) => l.label === location)?.fee ?? DEFAULT_DELIVERY_FEE
  const delivery = lines.length ? deliveryFee : 0

  // One line per product for the API, however many colour/closure variants are in the cart.
  const checkoutItems = () =>
    Object.entries(
      lines.reduce((acc, line) => ({ ...acc, [line.productId]: (acc[line.productId] ?? 0) + line.quantity }), {}),
    ).map(([id, quantity]) => ({ id, quantity }))

  // Units of a product across all its variants, to keep within stock.
  const quantityOf = (productId) =>
    lines.filter((line) => line.productId === productId).reduce((sum, line) => sum + line.quantity, 0)

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
    sync,
    checkoutItems,
    quantityOf,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
