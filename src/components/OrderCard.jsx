import { formatNaira } from '../format.js'

const dateFormat = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })

const statusStyles = {
  pending: 'bg-amber-100 text-amber-900',
  paid: 'bg-sky-100 text-sky-900',
  shipped: 'bg-indigo-100 text-indigo-900',
  delivered: 'bg-emerald-100 text-emerald-900',
  cancelled: 'bg-neutral-200 text-neutral-700',
}

export function OrderStatus({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status] ?? statusStyles.cancelled}`}>
      {status}
    </span>
  )
}

export default function OrderCard({ order, actions, customer }) {
  const items = order.OrderItems ?? []

  return (
    <li className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-logo text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
          <p className="text-xs text-neutral-500">
            <time dateTime={order.createdAt}>{dateFormat.format(new Date(order.createdAt))}</time>
            {customer && order.User && (
              <>
                {' · '}
                {order.User.name} ({order.User.email})
              </>
            )}
          </p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      {items.length > 0 && (
        <ul className="mt-4 divide-y divide-neutral-100 border-y border-neutral-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2 text-xs">
              {item.Product?.image ? (
                <img src={item.Product.image} alt="" className="size-10 shrink-0 bg-neutral-100 object-cover" />
              ) : (
                <span className="size-10 shrink-0 bg-neutral-100" />
              )}
              <span className="min-w-0 flex-1 truncate">
                {item.Product ? (
                  <a href={`#/product/${item.Product.id}`} className="hover:underline">
                    {item.Product.name}
                  </a>
                ) : (
                  <span className="text-neutral-500">Product no longer available</span>
                )}
              </span>
              <span className="text-neutral-500">× {item.quantity}</span>
              <span className="w-20 text-right font-logo font-medium">{formatNaira(Number(item.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          Total <span className="font-logo font-semibold">{formatNaira(Number(order.totalAmount), true)}</span>
        </p>
        {actions}
      </div>
    </li>
  )
}
