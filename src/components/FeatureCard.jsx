export default function FeatureCard({ image, title, description, cta, large = false }) {
  return (
    <article className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl p-5 text-white md:min-h-95">
      <img src={image} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/35" />

      <div className={large ? 'max-w-sm md:mb-6' : 'md:mb-28'}>
        <h3 className={large ? 'text-2xl md:text-3xl' : 'text-xl'}>{title}</h3>
        <p className={`mt-3 text-white/90 ${large ? 'text-base' : 'text-xs'}`}>{description}</p>
        {cta && (
          <a
            href={cta.href}
            className="mt-5 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink hover:bg-neutral-100"
          >
            {cta.label}
          </a>
        )}
      </div>
    </article>
  )
}
