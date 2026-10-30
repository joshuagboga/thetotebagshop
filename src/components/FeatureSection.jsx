import FeatureCard from './FeatureCard.jsx'
import explore from '../../assets/explore.jpg'
import branded from '../../assets/branded.jpg'
import office from '../../assets/office-totes.png'

export default function FeatureSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-10 md:grid-cols-[2fr_1fr_1fr]">
      <FeatureCard
        large
        image={explore}
        title="Explore the totebag fashion"
        description="Totes are reliable carriage that adds to the details of your dress fashion with contradicting your fashion sense."
        cta={{ label: 'Shop now', href: '#shop' }}
      />
      <FeatureCard
        image={branded}
        title="Branded Collections"
        description="Customize your style and brands here on thetotebagshop."
      />
      <FeatureCard
        image={office}
        title="Totes as Office wears."
        description="Totes can be worn to workspaces and to the office likewise."
      />
    </section>
  )
}
