import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api.js'

// Shoppers never see products an admin has switched off.
const visible = (products) => products.filter((p) => p.status !== 'inactive')

// A paginated product list that refetches when the search or category changes.
export function useProductList({ search = '', category = '', limit = 12, enabled = true, includeInactive = false }) {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [status, setStatus] = useState(enabled ? 'loading' : 'idle')
  const [error, setError] = useState(null)
  const requestId = useRef(0)
  const lastPage = useRef(1)

  const load = useCallback(
    async (page) => {
      const id = ++requestId.current
      lastPage.current = page
      setStatus(page === 1 ? 'loading' : 'loadingMore')
      setError(null)
      try {
        const res = await api.listProducts({ search: search.trim(), category, page, limit })
        if (id !== requestId.current) return
        const batch = includeInactive ? res.data : visible(res.data)
        setProducts((current) => (page === 1 ? batch : [...current, ...batch]))
        setPagination(res.pagination)
        setStatus('ready')
      } catch (err) {
        if (id !== requestId.current) return
        setError(err.message)
        setStatus('error')
      }
    },
    [search, category, limit, includeInactive],
  )

  useEffect(() => {
    if (enabled) load(1)
  }, [enabled, load])

  return {
    products,
    pagination,
    status,
    error,
    hasMore: Boolean(pagination?.hasMore),
    loadMore: () => load((pagination?.page ?? 0) + 1),
    retry: () => load(lastPage.current),
    reload: () => load(1),
  }
}

export function useProduct(id) {
  const [state, setState] = useState({ product: null, status: 'loading', error: null })

  const load = useCallback(() => {
    let cancelled = false
    setState((s) => ({ ...s, status: 'loading', error: null }))
    api
      .getProduct(id)
      .then((res) => !cancelled && setState({ product: res.data, status: 'ready', error: null }))
      .catch(
        (err) =>
          !cancelled &&
          setState({ product: null, status: err.status === 404 ? 'missing' : 'error', error: err.message }),
      )
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(load, [load])

  return { ...state, retry: load }
}

export function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export const isPurchasable = (product) => product.status === 'available' && product.stock > 0
