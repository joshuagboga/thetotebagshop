// Thin client for the LunaVest e-commerce API.
// Every response is `{ success, message?, data?, ... }`; failures throw ApiError
// carrying the server's message so the UI can show it as-is.

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'https://lunavest-ecormerce.onrender.com').replace(/\/$/, '')
const TOKEN_KEY = 'thetotebagshop:token'

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

let token = readToken()
let onUnauthorized = null

export const getToken = () => token

export const setToken = (value) => {
  token = value
  try {
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage can be unavailable (private mode); the session lives in memory.
  }
}

// Called when a signed-in request comes back 401 (e.g. the 8-hour token expired).
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, query } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`

  let payload = body
  // FormData sets its own multipart boundary, so only JSON gets a Content-Type.
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const url = new URL(BASE_URL + path)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
  }

  let res
  try {
    res = await fetch(url, { method, headers, body: payload })
  } catch {
    throw new ApiError('We couldn’t reach the shop server. Check your connection and try again.', 0)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === false) {
    if (res.status === 401 && token) onUnauthorized?.()
    throw new ApiError(data.message || `Something went wrong (error ${res.status}).`, res.status)
  }
  return data
}

export const api = {
  // Auth
  register: ({ name, email, password }) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  login: ({ email, password }) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me'),

  // Products
  listProducts: ({ search, category, page = 1, limit = 12 } = {}) =>
    request('/products/seeAllproducts', { query: { search, category, page, limit } }),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (formData) => request('/products/generate_products', { method: 'POST', body: formData }),
  updateProduct: (id, body) => request(`/products/update/${id}`, { method: 'PUT', body }),
  deleteProduct: (id) => request(`/products/deleteProducts/${id}`, { method: 'DELETE' }),

  // Likes
  toggleLike: (id) => request(`/products/like/${id}`, { method: 'POST' }),
  likedProducts: () => request('/products/liked'),

  // Orders — send ids and quantities only; the server prices the order.
  checkout: (items) => request('/orders/checkout', { method: 'POST', body: { items } }),
  myOrders: () => request('/orders/my-orders'),
  getOrder: (id) => request(`/orders/${id}`),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: 'PATCH' }),
  allOrders: (status) => request('/orders', { query: { status } }),
  setOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status } }),
}
