import { useEffect, useState } from 'react'
import { FormError } from '../components/Status.jsx'
import { useAuth } from '../AuthContext.jsx'
import { navigate } from '../useRoute.js'

// "#/login/cart" returns to the cart, "#/login/product-<id>" to that product.
const destination = (redirect) => {
  if (!redirect) return '/account'
  const [page, ...rest] = redirect.split('-')
  return rest.length ? `/${page}/${rest.join('-')}` : `/${page}`
}

const inputClass =
  'mt-2 w-full rounded border border-neutral-200 bg-[#f4fbfb] px-3 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-pine'

export default function AuthPage({ mode, redirect }) {
  const { user, login, register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isRegister = mode === 'register'

  useEffect(() => {
    if (user) navigate(destination(redirect))
  }, [user, redirect])

  const field = (name) => ({
    name,
    value: form[name],
    onChange: (e) => setForm({ ...form, [name]: e.target.value }),
  })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isRegister) await register(form)
      else await login(form)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const otherHref = `#/${isRegister ? 'login' : 'register'}${redirect ? `/${redirect}` : ''}`

  return (
    <main className="mx-auto max-w-md px-4 pt-12 pb-24">
      <div className="bg-[#eef3f3] px-6 py-10 sm:px-12">
        <h1 className="text-center text-2xl font-medium">{isRegister ? 'Create an account.' : 'Welcome back.'}</h1>
        <p className="mt-1 text-center text-xs text-neutral-600">
          {isRegister ? 'Sign up to save favourites and track your orders.' : 'Sign in to check out and see your orders.'}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          {isRegister && (
            <label className="block text-sm">
              Full name
              <input required minLength={4} autoComplete="name" placeholder="Amina Yusuf" className={inputClass} {...field('name')} />
            </label>
          )}
          <label className="block text-sm">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              {...field('email')}
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              required
              type="password"
              minLength={isRegister ? 5 : undefined}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder={isRegister ? 'At least 5 characters' : ''}
              className={inputClass}
              {...field('password')}
            />
          </label>

          <FormError message={error} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-pine py-3 text-sm text-white hover:bg-pine/85 disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-600">
          {isRegister ? 'Already have an account?' : 'New to thetotebagshop?'}{' '}
          <a href={otherHref} className="font-medium text-ink underline hover:opacity-70">
            {isRegister ? 'Sign in' : 'Create an account'}
          </a>
        </p>
      </div>
    </main>
  )
}
