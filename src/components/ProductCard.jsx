const naira = new Intl.NumberFormat('en-NG')

export default function ProductCard({ product }) {
  return (
    <a href="#" className="group block">
      <div className="aspect-[204/222] overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-6 flex items-center justify-between px-1 text-sm">
        <span>{product.name}</span>
        <span className="font-logo text-xs font-medium">N{naira.format(product.price)}</span>
      </div>
    </a>
  )
}
