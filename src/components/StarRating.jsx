import { StarIcon } from './Icons.jsx'

const sizes = {
  sm: { box: 'size-4.5', star: 'size-3' },
  md: { box: 'size-6', star: 'size-4' },
}

// Dark tiles with yellow stars; a half-filled star covers values ending in .5.
export default function StarRating({ rating, size = 'md' }) {
  const { box, star } = sizes[size]

  return (
    <div className="flex gap-1" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.min(Math.max(rating - n + 1, 0), 1)
        const width = fill >= 0.75 ? '100%' : fill >= 0.25 ? '50%' : '0%'
        return (
          <span key={n} className={`relative grid place-items-center rounded-sm bg-pine ${box}`}>
            <StarIcon className={`${star} fill-none stroke-yellow-400`} />
            <span className="absolute inset-0 grid place-items-center overflow-hidden" style={{ clipPath: `inset(0 calc(100% - ${width}) 0 0)` }}>
              <StarIcon className={`${star} fill-yellow-400 stroke-yellow-400`} />
            </span>
          </span>
        )
      })}
    </div>
  )
}
