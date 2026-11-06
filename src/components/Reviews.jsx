import StarRating from './StarRating.jsx'
import { reviews } from '../data/reviews.js'

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Reviews({ product }) {
  return (
    <section className="mt-10 md:ml-auto md:w-1/2 md:pl-3">
      <h3 className="text-base font-medium">Customers Reviews</h3>
      <p className="text-[0.65rem] text-neutral-600">Testimonies from customers.</p>

      <ul className="mt-4 space-y-8">
        {reviews.map((review) => (
          <li key={review.id} className="flex gap-2">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-neutral-200 bg-sky-200 font-medium text-pine"
            >
              {review.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg">{review.name}</p>
              <p className="text-xs text-neutral-500">
                <time dateTime={review.date}>{dateFormat.format(new Date(review.date))}</time>
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
                Rating: <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="mt-2 flex flex-wrap gap-x-1.5 text-sm text-neutral-600">
                <span>
                  Size: <span className="text-ink">{review.size}</span>
                </span>
                <span className="text-neutral-300">|</span>
                <span>
                  Color: <span className="text-ink">{review.color}</span>
                </span>
                <span className="text-neutral-300">|</span>
                <span>
                  Design element: <span className="text-xs text-ink">{review.design}</span>
                </span>
              </p>

              <div className="mt-3 size-28 border border-neutral-200 bg-white p-3">
                <img src={product.image} alt={`${review.name}’s ${product.name}`} className="size-full object-cover" />
              </div>

              <p className="mt-3 text-xs leading-relaxed text-neutral-600">{review.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
