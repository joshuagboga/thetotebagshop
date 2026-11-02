import { useEffect, useState } from 'react'
import ProductGrid from '../components/ProductGrid.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import StarRating from '../components/StarRating.jsx'
import Reviews from '../components/Reviews.jsx'
import { CheckCircleIcon, ChevronDownIcon, TruckIcon } from '../components/Icons.jsx'
import { closures, colors, getProduct, locations, similarProducts } from '../data/products.js'
import { useCart } from '../CartContext.jsx'
import { formatNaira, formatNumber } from '../format.js'
import { navigate } from '../useRoute.js'

export default function ProductPage({ id }) {
  const product = getProduct(id)
  const { addItem, location, setLocation, deliveryFee } = useCart()
  const [color, setColor] = useState(colors[0])
  const [closure, setClosure] = useState(closures.at(-1).label)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 2000)
    return () => clearTimeout(timer)
  }, [added])

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-10">
        <h1 className="text-2xl font-semibold">We couldn’t find that totebag.</h1>
        <a href="#shop" className="mt-6 inline-block rounded-md bg-pine px-6 py-3 text-sm text-white hover:bg-pine/80">
          Back to shop
        </a>
      </main>
    )
  }

  const addToCart = () => addItem({ productId: product.id, color, closure, quantity })

  return (
    <main className="space-y-16 pb-24">
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-10">
        <h1 className="text-3xl font-medium">Your Cart.</h1>
        <p className="mt-1 text-xs text-neutral-600">Review and manage the items in your shopping cart.</p>

        <div className="mt-5 grid gap-8 md:grid-cols-2 md:gap-3">
          <div>
            <div className="aspect-[4/3] overflow-hidden border border-neutral-200 bg-neutral-100">
              <img src={product.image} alt={product.alt} className="size-full object-cover" />
            </div>

            <fieldset className="mt-4">
              <legend className="sr-only">Colour</legend>
              <div className="flex justify-center gap-3">
                {colors.map((c) => (
                  <label key={c} className="cursor-pointer text-center">
                    <input
                      type="radio"
                      name="color"
                      value={c}
                      checked={color === c}
                      onChange={() => setColor(c)}
                      className="peer sr-only"
                    />
                    <img
                      src={product.image}
                      alt=""
                      className="size-18 border border-neutral-200 object-cover peer-checked:ring-2 peer-checked:ring-pine peer-focus-visible:ring-2 peer-focus-visible:ring-pine/60"
                    />
                    <span className="mt-1.5 block text-xs uppercase">{c}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-4 text-center">
              <legend className="sr-only">Closure</legend>
              <div className="inline-flex flex-wrap justify-center gap-1 rounded-md border border-neutral-200 bg-white p-1">
                {closures.map((c) => (
                  <label key={c.label} className="cursor-pointer">
                    <input
                      type="radio"
                      name="closure"
                      value={c.label}
                      checked={closure === c.label}
                      onChange={() => setClosure(c.label)}
                      className="peer sr-only"
                    />
                    <span className="flex items-center gap-1 rounded px-2 py-1 text-xs text-neutral-700 peer-checked:bg-pine peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-pine/60">
                      <CheckCircleIcon className="size-3.5" />
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-[0.65rem] text-neutral-600">
                Zip cost N{formatNumber(closures[0].cost)} extra while button cost N{formatNumber(closures[1].cost)}
              </p>
            </fieldset>
          </div>

          <div className="md:pl-3">
            <p className="text-xs">Product</p>
            <p className="mt-1 inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-2 py-1">
              <TruckIcon className="size-5 text-pine" />
              Delivery fee
              <span className="rounded bg-pine px-2 py-0.5 text-[0.65rem] text-white">{formatNumber(deliveryFee)}</span>
            </p>

            <h2 className="mt-4 text-xl font-medium">{product.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="rounded border border-neutral-200 bg-white px-1.5 text-sm font-medium">{product.rating}</span>
            </div>

            <div className="mt-5 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-2">
                Price:
                <span className="rounded border border-neutral-200 bg-white px-2 py-1 font-logo text-sm font-medium">
                  {formatNaira(product.price)}
                </span>
              </span>
              <span className="h-8 w-0.5 bg-neutral-300" />
              <span className="flex items-center gap-2">
                Quantity:
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </span>
            </div>

            <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-neutral-600">{product.description}</p>

            <div className="mt-5 max-w-68 space-y-3">
              <button
                type="button"
                onClick={() => {
                  addToCart()
                  navigate('/cart')
                }}
                className="w-full rounded border border-neutral-400 bg-white py-2.5 text-sm hover:bg-neutral-50"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart()
                  setAdded(true)
                }}
                className="w-full rounded bg-pine py-2.5 text-sm text-white hover:bg-pine/85"
              >
                {added ? 'Added to cart ✓' : 'Add to cart'}
              </button>
            </div>

            <label className="relative mt-4 block">
              <span className="sr-only">Delivery location</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full appearance-none rounded border border-pine/40 bg-[#e1eaea] px-3 py-3 pr-10 text-sm text-pine outline-none focus:border-pine"
              >
                <option value="">Select your location</option>
                {locations.map((l) => (
                  <option key={l.label} value={l.label}>
                    {l.label} — {formatNaira(l.fee)} delivery
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
            </label>
          </div>
        </div>

        <h3 className="mt-8 text-sm font-semibold">Description</h3>
        <p className="mt-1 text-xs leading-relaxed text-neutral-700">{product.description}</p>

        <Reviews product={product} />
      </section>

      <ProductGrid
        title="Totebags you may like"
        subtitle="Similar totebags like the one selected."
        products={similarProducts(product)}
      />
    </main>
  )
}
