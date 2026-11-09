import { useCallback, useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard.jsx'
import { CloseIcon, PencilIcon, PlusIcon, TrashIcon } from '../components/Icons.jsx'
import { EmptyState, ErrorMessage, FormError, Loading } from '../components/Status.jsx'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import { productCategories, productStatuses } from '../data/options.js'
import { formatNaira } from '../format.js'
import { useDebounced, useProductList } from '../useProducts.js'
import { navigate } from '../useRoute.js'

const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
]

const orderStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const inputClass =
  'mt-1.5 w-full rounded border border-neutral-200 bg-[#f4fbfb] px-3 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-pine'

export default function AdminPage({ tab = 'products' }) {
  const { user, checking, isAdmin } = useAuth()

  useEffect(() => {
    if (!checking && !user) navigate('/login/admin')
  }, [checking, user])

  if (!user) return <Loading className="py-32" />

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-10">
        <h1 className="text-2xl font-semibold">This page is for shop admins.</h1>
        <a href="#shop" className="mt-6 inline-block rounded-md bg-pine px-6 py-3 text-sm text-white hover:bg-pine/80">
          Back to shop
        </a>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-10">
      <h1 className="text-3xl font-medium">Admin dashboard.</h1>
      <p className="mt-1 text-xs text-neutral-600">Manage the catalogue and keep orders moving.</p>

      <nav className="mt-8 flex gap-6 border-b border-neutral-200 text-sm" aria-label="Admin sections">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#/admin/${t.id}`}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`-mb-px border-b-2 pb-2 ${tab === t.id ? 'border-pine font-medium' : 'border-transparent text-neutral-600 hover:text-ink'}`}
          >
            {t.label}
          </a>
        ))}
      </nav>

      <div className="mt-6">{tab === 'orders' ? <AdminOrders /> : <AdminProducts />}</div>
    </main>
  )
}

function AdminProducts() {
  const [query, setQuery] = useState('')
  const search = useDebounced(query)
  const list = useProductList({ search, limit: 48, includeInactive: true })
  // null: closed, {}: new product, product: editing it.
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const remove = async (product) => {
    if (!confirm(`Delete “${product.name}”? This can’t be undone.`)) return
    setDeleting(product.id)
    try {
      await api.deleteProduct(product.id)
      list.reload()
    } catch (err) {
      alert(err.status === 409 ? `${err.message}\n\nTip: set its status to “inactive” to hide it instead.` : err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          className="w-full max-w-xs rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-pine"
        />
        <button
          type="button"
          onClick={() => setEditing({})}
          className="flex items-center gap-1.5 rounded-md bg-pine px-4 py-2 text-xs text-white hover:bg-pine/80"
        >
          <PlusIcon className="size-4" />
          Add product
        </button>
      </div>

      {list.status === 'loading' && <Loading label="Loading products…" />}
      {list.status === 'error' && <ErrorMessage className="mt-6" message={list.error} onRetry={list.retry} />}
      {list.status !== 'loading' && list.status !== 'error' && list.products.length === 0 && (
        <EmptyState className="mt-6" title={search ? 'No products match.' : 'No products yet.'}>
          <p className="mt-1 text-sm text-neutral-600">Add your first totebag to open the shop.</p>
        </EmptyState>
      )}

      {list.products.length > 0 && list.status !== 'loading' && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-xl text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs text-neutral-500">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">Stock</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.products.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2">
                    <a href={`#/product/${p.id}`} className="flex items-center gap-3 hover:underline">
                      <img src={p.image} alt="" className="size-10 shrink-0 bg-neutral-100 object-cover" />
                      <span className="line-clamp-2">{p.name}</span>
                    </a>
                  </td>
                  <td className="px-3 py-2 text-xs">{p.category}</td>
                  <td className="px-3 py-2 text-right font-logo text-xs">{formatNaira(Number(p.price))}</td>
                  <td className="px-3 py-2 text-right text-xs">{p.stock}</td>
                  <td className="px-3 py-2 text-xs capitalize">{p.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        aria-label={`Edit ${p.name}`}
                        className="grid size-7 place-items-center rounded border border-neutral-300 hover:bg-neutral-50"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        disabled={deleting === p.id}
                        aria-label={`Delete ${p.name}`}
                        className="grid size-7 place-items-center rounded bg-pine text-white hover:bg-pine/80 disabled:opacity-50"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {list.hasMore && list.status !== 'loading' && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={list.loadMore}
            disabled={list.status === 'loadingMore'}
            className="rounded-md border border-neutral-400 bg-white px-6 py-2 text-xs hover:bg-neutral-50 disabled:opacity-60"
          >
            {list.status === 'loadingMore' ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {editing && (
        <ProductForm
          product={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            list.reload()
          }}
        />
      )}
    </section>
  )
}

function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product ? String(Number(product.price)) : '',
    stock: product ? String(product.stock) : '',
    category: product?.category ?? productCategories[0],
    status: product?.status ?? 'available',
  }))
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(product?.image ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!image) return
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const field = (name) => ({ name, value: form[name], onChange: (e) => setForm({ ...form, [name]: e.target.value }) })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (!product || image) {
        // Creating, or replacing the image, has to go as multipart form data.
        const data = new FormData()
        for (const [key, value] of Object.entries(form)) data.append(key, value)
        if (image) data.append('image', image)
        if (product) await api.updateProduct(product.id, data)
        else await api.createProduct(data)
      } else {
        await api.updateProduct(product.id, { ...form, price: Number(form.price), stock: Number(form.stock) })
      }
      onSaved()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="relative w-full max-w-lg bg-[#eef3f3] px-6 py-8 shadow-xl sm:px-10"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-3 hover:opacity-60">
          <CloseIcon className="size-5" />
        </button>
        <h2 id="product-form-title" className="text-xl font-medium">
          {product ? 'Edit product.' : 'Add a product.'}
        </h2>

        <div className="mt-6 space-y-4">
          <label className="block text-sm">
            Name
            <input required autoFocus className={inputClass} placeholder="Green Monocle totebag" {...field('name')} />
          </label>
          <label className="block text-sm">
            Description
            <textarea required rows={4} className={inputClass} {...field('description')} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Price (₦)
              <input required type="number" min="0" step="any" className={inputClass} {...field('price')} />
            </label>
            <label className="block text-sm">
              Stock
              <input required type="number" min="0" step="1" className={inputClass} {...field('stock')} />
            </label>
            <label className="block text-sm">
              Category
              <select className={inputClass} {...field('category')}>
                {[...new Set([...productCategories, form.category])].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Status
              <select className={`${inputClass} capitalize`} {...field('status')}>
                {productStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-4">
            {preview && <img src={preview} alt="" className="size-16 shrink-0 border border-neutral-200 object-cover" />}
            <label className="block flex-1 text-sm">
              {product ? 'Replace image (optional)' : 'Image'}
              <input
                type="file"
                accept="image/*"
                required={!product}
                onChange={(e) => setImage(e.target.files[0] ?? null)}
                className="mt-1.5 block w-full text-xs file:mr-3 file:rounded file:border-0 file:bg-pine file:px-3 file:py-2 file:text-white"
              />
            </label>
          </div>

          <FormError message={error} />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded bg-pine py-3 text-sm text-white hover:bg-pine/85 disabled:opacity-60"
        >
          {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
        </button>
      </form>
    </div>
  )
}

function AdminOrders() {
  const [filter, setFilter] = useState('')
  const [state, setState] = useState({ orders: [], status: 'loading', error: null })
  const [updating, setUpdating] = useState(null)

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }))
    api
      .allOrders(filter)
      .then((res) => setState({ orders: res.data, status: 'ready', error: null }))
      .catch((err) => setState({ orders: [], status: 'error', error: err.message }))
  }, [filter])

  useEffect(load, [load])

  const changeStatus = async (order, status) => {
    if (status === 'cancelled' && !confirm(`Cancel order #${order.id.slice(0, 8)} and restock its items?`)) return
    setUpdating(order.id)
    try {
      const res = await api.setOrderStatus(order.id, status)
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === order.id ? { ...o, status: res.data?.status ?? status } : o)),
      }))
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <section>
      <label className="flex items-center gap-2 text-sm">
        Show
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-pine"
        >
          <option value="">All orders</option>
          {orderStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6">
        {state.status === 'loading' && <Loading label="Loading orders…" />}
        {state.status === 'error' && <ErrorMessage message={state.error} onRetry={load} />}
        {state.status === 'ready' && state.orders.length === 0 && <EmptyState title="No orders here yet." />}
        {state.status === 'ready' && state.orders.length > 0 && (
          <ul className="space-y-4">
            {state.orders.map((order) => {
              const locked = order.status === 'delivered' || order.status === 'cancelled'
              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  customer
                  actions={
                    <label className="flex items-center gap-2 text-xs">
                      Status
                      <select
                        value={order.status}
                        disabled={locked || updating === order.id}
                        onChange={(e) => changeStatus(order, e.target.value)}
                        className="rounded border border-neutral-300 bg-white px-2 py-1.5 capitalize outline-none focus:border-pine disabled:opacity-60"
                      >
                        {orderStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  }
                />
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
