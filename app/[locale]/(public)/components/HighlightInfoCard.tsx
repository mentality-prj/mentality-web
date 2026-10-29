import { GlassMedallion } from './glass/GlassMedallion'
import { WaterSurface } from './water/WaterSurface'
import { landingH2 } from './landingStyles'

interface HighlightInfoCardProps {
  title: string
  subtitle: string
}

const DUSK = { deep: '#a995e6', mid: '#efe6fd', light: '#fff6f1' }

export function HighlightInfoCard({ title, subtitle }: HighlightInfoCardProps) {
  return (
    <article className="flex w-full flex-col gap-6">
      <div>
        <h2 className={landingH2}>{title}</h2>
        <p className="mt-4 max-w-md text-base leading-[1.75] text-[#575570]">{subtitle}</p>
      </div>
      <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(80,60,150,0.5)]">
        <WaterSurface colors={DUSK} source={{ x: 0.5, y: 0.52 }} every={4} interactive className="absolute inset-0" />
        <GlassMedallion
          glyph="bell"
          tone="lilac"
          size={104}
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </article>
  )
}
