import { useState } from 'react'
import { HeartIcon } from './Icons.jsx'
import { useAuth } from '../AuthContext.jsx'
import { navigate } from '../useRoute.js'

export default function LikeButton({ product, className = '' }) {
  const { user, likedIds, toggleLike } = useAuth()
  const [busy, setBusy] = useState(false)
  const liked = likedIds.has(product.id)

  const onClick = async (e) => {
    // The button sits on top of a card link; don't open the product too.
    e.preventDefault()
    e.stopPropagation()
    if (!user) return navigate(`/login/product-${product.id}`)
    setBusy(true)
    try {
      await toggleLike(product.id)
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={liked}
      aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={`grid size-8 place-items-center rounded-full bg-white/90 shadow-sm hover:bg-white disabled:opacity-60 ${className}`}
    >
      <HeartIcon className={`size-4.5 ${liked ? 'fill-red-500 stroke-red-500' : 'text-ink'}`} />
    </button>
  )
}
