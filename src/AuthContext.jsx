import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken, setUnauthorizedHandler } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // While a saved token is being checked we don't know yet who is signed in.
  const [checking, setChecking] = useState(() => Boolean(getToken()))
  const [likedIds, setLikedIds] = useState(() => new Set())

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setLikedIds(new Set())
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  useEffect(() => {
    if (!getToken()) return
    api
      .me()
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.status === 401 || err.status === 404) logout()
      })
      .finally(() => setChecking(false))
  }, [logout])

  // The wishlist tells us which hearts to fill in across the shop.
  const refreshLikes = useCallback(async () => {
    const res = await api.likedProducts()
    setLikedIds(new Set(res.data.map((p) => p.id)))
    return res.data
  }, [])

  useEffect(() => {
    if (user) refreshLikes().catch(() => {})
  }, [user, refreshLikes])

  const login = async (credentials) => {
    const res = await api.login(credentials)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const register = async ({ name, email, password }) => {
    // Registering doesn't return a token, so sign straight in afterwards.
    await api.register({ name, email, password })
    return login({ email, password })
  }

  const toggleLike = async (productId) => {
    const res = await api.toggleLike(productId)
    setLikedIds((current) => {
      const next = new Set(current)
      if (res.liked) next.add(productId)
      else next.delete(productId)
      return next
    })
    return res.liked
  }

  const value = {
    user,
    checking,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    likedIds,
    toggleLike,
    refreshLikes,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
