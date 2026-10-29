import { BellIllustration } from './LandingIllustrations'
import { landingH2 } from './landingStyles'

interface HighlightInfoCardProps {
  title: string
  subtitle: string
}

export function HighlightInfoCard({ title, subtitle }: HighlightInfoCardProps) {
  return (
    <article className="flex w-full flex-col gap-6">
      <div>
        <h2 className={landingH2}>{title}</h2>
        <p className="mt-4 max-w-md text-base leading-[1.75] text-[#575570]">{subtitle}</p>
      </div>
      <div className="aspect-[5/3] w-full overflow-hidden rounded-[28px] border border-[#ece6f6]">
        <BellIllustration />
      </div>
    </article>
  )
}
