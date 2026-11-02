import { MinusIcon, PlusIcon } from './Icons.jsx'

export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-1.5 py-1">
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(value + 1, max))}
        className="hover:opacity-60 disabled:opacity-30"
        disabled={value >= max}
      >
        <PlusIcon className="size-4" />
      </button>
      <span className="min-w-5 rounded border border-neutral-200 px-1 text-center text-xs" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(value - 1, min))}
        className="hover:opacity-60 disabled:opacity-30"
        disabled={value <= min}
      >
        <MinusIcon className="size-4" />
      </button>
    </div>
  )
}
