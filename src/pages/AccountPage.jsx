import { useCallback, useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { EmptyState, ErrorMessage, Loading } from '../components/Status.jsx'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { navigate } from '../useRoute.js'

const tabs = [
  { id: 'orders', label: 'My orders' },
  { id: 'wishlist', label: 'Wishlist' },
]

export default function AccountPage({ tab = 'orders' }) {
  const { user, checking, logout, isAdmin } = useAuth()

  useEffect(() => {
    if (!checking && !user) navigate('/login/account')
  }, [checking, user])

  if (!user) return <Loading className="py-32" />

  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">Hi, {user.name.split(' ')[0]}.</h1>
          <p className="mt-1 text-xs text-neutral-600">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <a href="#/admin" className="rounded-md bg-pine px-4 py-2 text-xs text-white hover:bg-pine/80">
              Admin dashboard
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('')
            }}
            className="rounded-md border border-neutral-400 bg-white px-4 py-2 text-xs hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      </div>

      <nav className="mt-8 flex gap-6 border-b border-neutral-200 text-sm" aria-label="Account sections">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#/account/${t.id}`}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`-mb-px border-b-2 pb-2 ${tab === t.id ? 'border-pine font-medium' : 'border-transparent text-neutral-600 hover:text-ink'}`}
          >
            {t.label}
          </a>
        ))}
      </nav>

      <div className="mt-6">{tab === 'wishlist' ? <Wishlist /> : <Orders />}</div>
    </main>
  )
}

function Orders() {
  const [state, setState] = useState({ orders: [], status: 'loading', error: null })
  const [cancelling, setCancelling] = useState(null)

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }))
    api
      .myOrders()
      .then((res) => setState({ orders: res.data, status: 'ready', error: null }))
      .catch((err) => setState({ orders: [], status: 'error', error: err.message }))
  }, [])

  useEffect(load, [load])

  const cancel = async (order) => {
    if (!confirm(`Cancel order #${order.id.slice(0, 8)}? This can’t be undone.`)) return
    setCancelling(order.id)
    try {
      const res = await api.cancelOrder(order.id)
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === order.id ? { ...o, ...res.data, OrderItems: res.data?.OrderItems ?? o.OrderItems } : o)),
      }))
    } catch (err) {
      alert(err.message)
    } finally {
      setCancelling(null)
    }
  }

  if (state.status === 'loading') return <Loading label="Loading your orders…" />
  if (state.status === 'error') return <ErrorMessage message={state.error} onRetry={load} />
  if (!state.orders.length) {
    return (
      <EmptyState title="You haven’t placed any orders yet.">
        <a href="#shop" className="mt-6 inline-block rounded-md bg-pine px-6 py-3 text-sm text-white hover:bg-pine/80">
          Start shopping
        </a>
      </EmptyState>
    )
  }

  return (
    <ul className="space-y-4">
      {state.orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          actions={
            ['pending', 'paid'].includes(order.status) && (
              <button
                type="button"
                onClick={() => cancel(order)}
                disabled={cancelling === order.id}
                className="rounded border border-red-300 px-3 py-1.5 text-xs text-red-800 hover:bg-red-50 disabled:opacity-60"
              >
                {cancelling === order.id ? 'Cancelling…' : 'Cancel order'}
              </button>
            )
          }
        />
      ))}
    </ul>
  )
}

function Wishlist() {
  const { refreshLikes, likedIds } = useAuth()
  const [state, setState] = useState({ products: [], status: 'loading', error: null })

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }))
    refreshLikes()
      .then((products) => setState({ products, status: 'ready', error: null }))
      .catch((err) => setState({ products: [], status: 'error', error: err.message }))
  }, [refreshLikes])

  useEffect(load, [load])

  if (state.status === 'loading') return <Loading label="Loading your wishlist…" />
  if (state.status === 'error') return <ErrorMessage message={state.error} onRetry={load} />

  // Unliking from a card removes it here straight away.
  const products = state.products.filter((p) => likedIds.has(p.id))
  if (!products.length) {
    return (
      <EmptyState title="Your wishlist is empty.">
        <p className="mt-1 text-sm text-neutral-600">Tap the heart on any totebag to save it here.</p>
        <a href="#shop" className="mt-6 inline-block rounded-md bg-pine px-6 py-3 text-sm text-white hover:bg-pine/80">
          Browse totebags
        </a>
      </EmptyState>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
