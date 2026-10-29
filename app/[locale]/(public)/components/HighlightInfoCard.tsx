import { DoodleIcon } from './doodle/DoodleIcon'
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
      <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[28px] border border-[#efe9e2] bg-[#fbf9f6]">
        <span aria-hidden="true" className="absolute left-[18%] top-[22%] h-2.5 w-2.5 rounded-full bg-[#d9d2e6]" />
        <span aria-hidden="true" className="absolute bottom-[20%] right-[20%] h-3 w-3 rounded-full bg-[#e7ddd2]" />
        <DoodleIcon
          name="bell"
          tone="lilac"
          size={220}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg]"
        />
      </div>
    </article>
  )
}
