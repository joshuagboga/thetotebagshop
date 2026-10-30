import womanWithBag from '../../assets/images.jpeg'
import womanWithHat from '../../assets/woman.png'

export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-10">
      <h2 className="text-2xl font-semibold">Shop your favourite totebag.</h2>
      <p className="mt-1 text-xs text-neutral-600">Select the totebag that matches your fashion.</p>

      <div className="relative mt-5 grid overflow-hidden rounded-3xl border border-neutral-300 bg-white md:h-75 md:grid-cols-[1fr_1fr_0.8fr]">
        <div className="relative z-10 flex flex-col p-6 md:p-12">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-5 rounded-full bg-neutral-800" />
            <span className="h-2 w-10 rounded-full bg-neutral-300" />
            <span className="h-2 w-5 rounded-full bg-neutral-800" />
            <span className="h-2 w-5 rounded-full bg-neutral-800" />
          </div>
          <div className="mt-10 md:mt-auto">
            <p className="font-logo text-sm uppercase tracking-wide text-neutral-600">Trending Totebags</p>
            <h3 className="mt-1 font-logo text-3xl font-medium md:whitespace-nowrap">Leather Totebags</h3>
            <p className="mt-4 max-w-64 font-logo text-xs leading-relaxed text-neutral-700">
              Totebag’s made with leather fabric. This fabric is usually stronger than the others.
            </p>
          </div>
        </div>

        <img
          src={womanWithBag}
          alt="Woman carrying a beige leather tote bag"
          className="h-64 w-full object-cover object-top mix-blend-multiply md:h-75"
        />
        <img
          src={womanWithHat}
          alt="Woman in a hat carrying a canvas tote bag"
          className="hidden h-75 w-full object-contain object-bottom mix-blend-multiply md:block"
        />
      </div>
    </section>
  )
}
