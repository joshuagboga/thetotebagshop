import LikeButton from './LikeButton.jsx'
import { formatNumber } from '../format.js'
import { isPurchasable } from '../useProducts.js'

export default function ProductCard({ product }) {
  return (
    <a href={`#/product/${product.id}`} className="group block">
      <div className="relative aspect-[204/222] overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <LikeButton product={product} className="absolute top-2 right-2" />
        {!isPurchasable(product) && (
          <span className="absolute bottom-2 left-2 rounded bg-ink/85 px-2 py-0.5 text-[0.65rem] text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between gap-2 px-1 text-sm">
        <span className="truncate">{product.name}</span>
        <span className="shrink-0 font-logo text-xs font-medium">N{formatNumber(Number(product.price))}</span>
      </div>
    </a>
  )
}
