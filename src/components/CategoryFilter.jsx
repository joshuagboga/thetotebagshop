import { FilterIcon } from './Icons.jsx'

export const categories = ['All', 'Corduroy', 'Denim', 'Adire', 'Leather']

export default function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {categories.map((category) => {
        const isActive = category === active
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
              isActive
                ? 'border-pine bg-pine text-white'
                : 'border-neutral-300 bg-white/60 hover:border-neutral-500'
            }`}
          >
            {category === 'All' && <FilterIcon className="size-4" />}
            {category}
          </button>
        )
      })}
    </div>
  )
}
