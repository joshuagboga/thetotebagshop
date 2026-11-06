import { useEffect, useState } from 'react'

// The API sleeps when idle and can take up to a minute to answer the first request.
export function Loading({ label = 'Loading…', className = '' }) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div role="status" className={`py-16 text-center text-sm text-neutral-600 ${className}`}>
      <span className="mx-auto mb-3 block size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-pine" />
      {label}
      {slow && <p className="mt-1 text-xs text-neutral-500">The shop server is waking up — this can take up to a minute.</p>}
    </div>
  )
}

export function ErrorMessage({ message, onRetry, className = '' }) {
  return (
    <div role="alert" className={`rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center ${className}`}>
      <p className="text-sm text-red-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-pine px-5 py-2 text-xs text-white hover:bg-pine/80"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, children, className = '' }) {
  return (
    <div className={`rounded-lg border border-neutral-200 bg-white px-6 py-16 text-center ${className}`}>
      <p className="text-lg">{title}</p>
      {children}
    </div>
  )
}

export function FormError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
      {message}
    </p>
  )
}
