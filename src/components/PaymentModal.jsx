import { useEffect, useRef, useState } from 'react'
import { CheckCircleIcon, CloseIcon } from './Icons.jsx'
import { FormError } from './Status.jsx'
import { api } from '../api.js'
import { useCart } from '../CartContext.jsx'
import { formatNaira } from '../format.js'

const MastercardMark = ({ className = '' }) => (
  <svg viewBox="0 0 32 20" aria-hidden="true" className={className}>
    <circle cx="11" cy="10" r="8" fill="#eb001b" />
    <circle cx="21" cy="10" r="8" fill="#f79e1b" fillOpacity="0.9" />
  </svg>
)

const methods = [
  { id: 'visa', label: 'Visa', mark: <span className="font-black italic tracking-tight">VISA</span> },
  { id: 'stripe', label: 'Stripe', mark: <span className="font-bold tracking-tight">stripe</span> },
  { id: 'mastercard', label: 'Mastercard', mark: <MastercardMark className="h-5" /> },
  { id: 'paypal', label: 'PayPal', mark: <span className="font-bold italic">PayPal</span> },
  { id: 'apple', label: 'Apple Pay', mark: <span className="font-semibold">Pay</span> },
]

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})(?=.)/g, '$1 ')

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export default function PaymentModal({ onClose }) {
  const { totals, clear, checkoutItems } = useCart()
  const [method, setMethod] = useState('mastercard')
  const [card, setCard] = useState({ number: '', cvv: '', expiry: '' })
  const [order, setOrder] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const dialog = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    dialog.current?.focus()
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  // The API places the order and holds the stock; the card details stay in the
  // browser because no payment provider is connected yet.
  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await api.checkout(checkoutItems())
      setOrder({ ...res.data, extras: totals.extras + totals.delivery })
      clear()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded border border-neutral-200 bg-[#f4fbfb] px-3 py-3 text-xs outline-none placeholder:text-neutral-400 focus:border-pine'

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        tabIndex={-1}
        className="relative w-full max-w-md bg-[#eef3f3] px-6 py-10 shadow-xl outline-none sm:px-20"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-3 hover:opacity-60">
          <CloseIcon className="size-5" />
        </button>

        {order ? (
          <div className="text-center">
            <CheckCircleIcon className="mx-auto size-12 text-pine" />
            <h2 id="payment-title" className="mt-4 text-xl font-medium">
              Order placed.
            </h2>
            <p className="mt-2 text-xs text-neutral-600">
              Order <span className="font-logo font-medium text-ink">#{order.id.slice(0, 8)}</span> for{' '}
              {formatNaira(Number(order.totalAmount), true)} has been placed
              {order.extras > 0 && <> — delivery and closure fees of {formatNaira(order.extras, true)} are paid on delivery</>}
              . Your totebag will be delivered in three to five working days.
            </p>
            <a
              href="#/account"
              onClick={onClose}
              className="mt-6 inline-block w-full rounded bg-pine py-3 text-xs text-white hover:bg-pine/85"
            >
              View my orders
            </a>
            <a href="#shop" onClick={onClose} className="mt-3 inline-block text-xs underline hover:opacity-70">
              Continue shopping
            </a>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 id="payment-title" className="text-center text-xl font-medium">
              Payment Method.
            </h2>
            <p className="mt-1 text-center text-[0.65rem]">Effortlessly manage your purchases and checkout with ease.</p>

            <div className="mt-3 flex items-center justify-center gap-1 text-xs" role="radiogroup" aria-label="Payment method">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={method === m.id}
                  aria-label={m.label}
                  onClick={() => setMethod(m.id)}
                  className={`grid h-6 min-w-9 place-items-center rounded px-1.5 ${
                    method === m.id ? 'bg-pine text-white' : 'hover:bg-black/5'
                  }`}
                >
                  {m.mark}
                </button>
              ))}
            </div>

            <label className="mt-8 block text-sm">
              Card Number
              <span className="relative block">
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  pattern="[\d ]{14,23}"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                  className={`${inputClass} pr-12`}
                />
                {method === 'mastercard' && (
                  <MastercardMark className="absolute top-1/2 right-3 h-4 -translate-y-1/4" />
                )}
              </span>
            </label>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <label className="block text-sm">
                CVV
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  pattern="\d{3,4}"
                  maxLength={4}
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                Expires
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  pattern="(0[1-9]|1[0-2])/\d{2}"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="mt-6">
              <FormError message={error} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded bg-pine py-3 text-xs text-white hover:bg-pine/85 disabled:opacity-60"
            >
              {submitting ? 'Placing your order…' : `Checkout ${formatNaira(totals.total, true)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
