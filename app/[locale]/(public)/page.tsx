import { FeatureCardsSection } from './components/FeatureCardsSection'
import { HeroSection } from './components/HeroSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { ServicesSection } from './components/ServicesSection'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureCardsSection />
      <ServicesSection />
      <HowItWorksSection />
    </>
  )
}
