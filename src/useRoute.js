import { useSyncExternalStore } from 'react'

// Routes live in the hash as "#/page/id". Any other hash ("", "#shop") is the
// home page, so in-page anchors keep working.
const subscribe = (callback) => {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

const getHash = () => window.location.hash

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, getHash)
  const [, page = 'home', id] = hash.match(/^#\/([\w-]+)(?:\/([\w-]+))?/) ?? []
  return { hash, page, id }
}

export const navigate = (hash) => {
  window.location.hash = hash
}
