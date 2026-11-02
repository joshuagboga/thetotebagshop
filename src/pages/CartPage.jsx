import { useState } from 'react'
import PaymentModal from '../components/PaymentModal.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import StarRating from '../components/StarRating.jsx'
import { CardIcon, InfoIcon, TrashIcon } from '../components/Icons.jsx'
import { useCart } from '../CartContext.jsx'
import { formatNaira } from '../format.js'

export default function CartPage() {
  const { lines, totals, updateQuantity, removeItem } = useCart()
  const [paying, setPaying] = useState(false)

  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-10">
      <h1 className="text-3xl font-medium">Shopping Cart.</h1>
      <p className="mt-1 text-xs text-neutral-600">Effortlessly manage your purchases and checkout with ease.</p>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-lg border border-neutral-200 bg-white px-6 py-16 text-center">
          <p className="text-lg">Your cart is empty.</p>
          <p className="mt-1 text-sm text-neutral-600">Find a totebag that matches your fashion.</p>
          <a href="#shop" className="mt-6 inline-block rounded-md bg-pine px-6 py-3 text-sm text-white hover:bg-pine/80">
            Continue shopping
          </a>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_240px]">
          <ul className="divide-y divide-neutral-200">
            {lines.map((line) => (
              <li key={line.key} className="flex flex-wrap items-center gap-x-6 gap-y-4 py-4 sm:flex-nowrap">
                <a href={`#/product/${line.product.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <img src={line.product.image} alt="" className="size-18 shrink-0 bg-neutral-100 object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-lg hover:underline">{line.product.title}</span>
                    <span className="block text-xs text-neutral-500">Closure: {line.closure}</span>
                    <span className="mt-1 block">
                      <StarRating rating={line.product.rating} size="sm" />
                    </span>
                    <span className="mt-1 block text-xs text-neutral-400">
                      Color: <span className="text-ink">{line.color}</span>
                    </span>
                  </span>
                </a>

                <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line.key, q)} />

                <span className="w-24 font-logo text-base font-semibold">
                  {formatNaira(line.product.price * line.quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(line.key)}
                  aria-label={`Remove ${line.product.title} from cart`}
                  className="grid size-7 place-items-center rounded bg-pine text-white hover:bg-pine/80"
                >
                  <TrashIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-md border border-neutral-200 bg-white/60 p-3">
              <h2 className="mt-4 font-semibold text-neutral-700">Order Summary</h2>
              <dl className="mt-4 space-y-4 text-xs text-neutral-600">
                <SummaryRow label="Subtotal" amount={totals.subtotal} />
                <SummaryRow label="Delivery" amount={totals.delivery} />
                {totals.extras > 0 && <SummaryRow label="Zip & Buttons" amount={totals.extras} />}
                <div className="flex justify-between border-y border-neutral-300 py-4 text-sm font-semibold text-ink">
                  <dt>Total</dt>
                  <dd className="font-logo">{formatNaira(totals.total, true)}</dd>
                </div>
              </dl>
              <p className="mt-4 flex gap-1.5 rounded-md border border-neutral-200 bg-white p-2 text-[0.65rem] text-neutral-700">
                <InfoIcon className="size-3.5 shrink-0" />
                Please your totebag will be delivered in three to five working days.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPaying(true)}
              className="mt-4 flex w-full items-center gap-2 rounded-md bg-pine px-3 py-2.5 text-xs text-white hover:bg-pine/85"
            >
              Payment options
              <CardIcon className="size-4" />
            </button>
          </aside>
        </div>
      )}

      {paying && <PaymentModal onClose={() => setPaying(false)} />}
    </main>
  )
}

function SummaryRow({ label, amount }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="font-logo font-semibold text-ink">{formatNaira(amount, true)}</dd>
    </div>
  )
}
