import Logo from './Logo.jsx'
import { ArrowRightIcon, InstagramIcon, TikTokIcon } from './Icons.jsx'

const quickLinks = ['Terms & Conditions', 'Privacy Policy', 'Contact Us', 'Terms of Service', 'Refund policy']

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* faint grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-10 md:grid-cols-[1.4fr_0.6fr_1fr]">
        <div>
          <p className="max-w-80 text-sm leading-relaxed text-white/90">
            We provide comfy tote bags that won’t mess up your style and have plenty of space for all your stuff.
          </p>
          <Logo className="mt-10 block text-4xl font-extralight md:text-5xl" />
          <div className="mt-8 flex gap-4">
            <a href="#" aria-label="TikTok" className="hover:opacity-70">
              <TikTokIcon className="size-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-70">
              <InstagramIcon className="size-6" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Quick links</h3>
          <ul className="mt-6 space-y-4 text-sm text-white/90">
            {quickLinks.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Connect with Us</h3>
          <p className="mt-6 text-sm leading-relaxed text-white/90">
            Subscribe to our Newsletter to be the first to be aware of recent production and other production offers.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex items-center rounded-lg bg-white/10 p-2 pl-4"
          >
            <input
              type="email"
              required
              placeholder="Enter email address"
              aria-label="Email address"
              className="flex-1 bg-transparent py-2 text-xs outline-none placeholder:text-white/50"
            />
            <button type="submit" aria-label="Subscribe" className="grid size-8 place-items-center rounded-md bg-pine hover:bg-pine/70">
              <ArrowRightIcon className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
