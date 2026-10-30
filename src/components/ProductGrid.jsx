import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ title, subtitle, products, id }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 sm:px-10">
      {title && <h2 className="text-2xl font-medium">{title}</h2>}
      {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
