import Image from 'next/image'

import { cn } from '@/lib/utils'

type ServicesCardProps = {
  title: string
  text: string
  imageSrc?: string
  className?: string
}

export default function ServicesCard({ title, text, imageSrc, className = '' }: ServicesCardProps) {
  return (
    <article className={cn('flex flex-col rounded-3xl bg-white shadow-sm', className)}>
      <div className="rounded-3xl bg-[var(--surface-secondary)]">
        {imageSrc ? (
          <div className="relative h-[220px] w-full overflow-hidden rounded-3xl">
            <Image src={imageSrc} alt="service" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
        ) : (
          <div className="h-[220px] w-full" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-base font-normal leading-[120%] text-[var(--title-color)]">{title}</h3>
        <p className="mt-2 text-base font-normal text-textcolor-secondary">{text}</p>
      </div>
    </article>
  )
}
