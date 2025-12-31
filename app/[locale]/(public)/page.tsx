import { LandingFooter, LandingHeader } from '@/components/Landing'

import { FeatureCardsSection } from './components/FeatureCardsSection'
import { HeroSection } from './components/HeroSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { ServicesSection } from './components/ServicesSection'

export default function LandingPage() {
  return (
    <main className="w-full">
      <LandingHeader />
      <HeroSection />
      <FeatureCardsSection />
      <ServicesSection />
      <HowItWorksSection />
      <LandingFooter />
    </main>
  )
}
