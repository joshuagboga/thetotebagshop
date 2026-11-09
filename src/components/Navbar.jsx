import Logo from './Logo.jsx'
import { CartIcon, UserIcon } from './Icons.jsx'
import { useAuth } from '../AuthContext.jsx'
import { useCart } from '../CartContext.jsx'
import { useRoute } from '../useRoute.js'

export default function Navbar() {
  const { count } = useCart()
  const { user, isAdmin } = useAuth()
  const { page } = useRoute()

  const links = [
    { label: 'Home', href: '#' },
    { label: 'Shop', href: '#shop', active: page === 'home' || page === 'product' },
    ...(isAdmin ? [{ label: 'Admin', href: '#/admin', active: page === 'admin' }] : []),
  ]

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-10">
      <nav className="flex gap-6 text-sm uppercase">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="relative pb-1 hover:opacity-70">
            {link.label}
            {link.active && (
              <span className="absolute -bottom-0.5 left-0 h-1 w-4 rounded-full bg-pine" />
            )}
          </a>
        ))}
      </nav>

      <a href="#" className="hidden sm:block">
        <Logo className="text-2xl md:text-3xl" />
      </a>

      <div className="flex items-center gap-5">
        <a
          href={user ? '#/account' : '#/login'}
          aria-label={user ? `Account (${user.name})` : 'Sign in'}
          className="flex items-center gap-1.5 hover:opacity-70"
        >
          <UserIcon className="size-6" />
          <span className="hidden text-xs md:inline">{user ? user.name.split(' ')[0] : 'Sign in'}</span>
        </a>
        <a href="#/cart" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`} className="relative hover:opacity-70">
          <CartIcon className="size-6" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full border border-page bg-ink" />
          )}
        </a>
      </div>
    </header>
  )
}
