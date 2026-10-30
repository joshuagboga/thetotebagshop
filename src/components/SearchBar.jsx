import { SearchIcon } from './Icons.jsx'

export default function SearchBar({ value, onChange }) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto flex w-full max-w-xl overflow-hidden rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
    >
      <button type="submit" aria-label="Search" className="grid w-11 place-items-center bg-pine text-white">
        <SearchIcon className="size-5" />
      </button>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="search for your favourite totebag, colour, design patterns"
        className="flex-1 px-4 py-3 text-sm outline-none placeholder:text-neutral-400"
      />
    </form>
  )
}
