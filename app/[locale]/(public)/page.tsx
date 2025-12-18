import { FeatureCardsSection } from './components/FeatureCardsSection'
import { HeroSection } from './components/HeroSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { LandingFooter } from './components/LandingFooter'
import { LandingHeader } from './components/LandingHeader'
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
