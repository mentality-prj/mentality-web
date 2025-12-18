import Image from 'next/image'

interface HighlightInfoCardProps {
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
}

export function HighlightInfoCard({ title, subtitle, imageSrc, imageAlt }: HighlightInfoCardProps) {
  return (
    <article className="flex w-full flex-col gap-6">
      <div>
        <h1 className="landing-h1">{title}</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-textcolor-secondary">{subtitle}</p>
      </div>
      <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[28px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 40vw, 100vw"
          priority={false}
        />
      </div>
    </article>
  )
}
