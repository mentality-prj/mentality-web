import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export type VerticalCardProps = {
  title?: string
  description: string
  imageSrc?: string
  imageAlt?: string
  tag?: string
  icon?: ReactNode
  href?: string
  ctaLabel?: string
  className?: string
  children?: ReactNode
  variant?: 'default' | 'background'
  backgroundImageSrc?: string
  smoothing?: boolean
}

export default function VerticalCard({
  title,
  description,
  imageSrc,
  imageAlt,
  tag,
  icon,
  href,
  ctaLabel,
  className,
  children,
  variant = 'default',
  backgroundImageSrc,
  ['smoothing']: smoothing = false,
}: VerticalCardProps) {
  const showCta = Boolean(href && ctaLabel)

  const altText = imageAlt ?? title ?? 'Service illustration'

  if (variant === 'background') {
    const backgroundSrc = backgroundImageSrc ?? imageSrc

    return (
      <article className={cn('relative flex min-h-[360px] flex-col justify-start', className)}>
        {backgroundSrc && (
          <div className="absolute inset-0 overflow-hidden rounded-[28px]">
            <Image
              src={backgroundSrc}
              alt={altText}
              fill
              className="object-cover opacity-50"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              priority={false}
            />
            {smoothing && (
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.6)_12%,rgba(255,255,255,0)_38%,rgba(255,255,255,0)_62%,rgba(255,255,255,0.6)_88%,rgba(255,255,255,1)_100%)]"
                aria-hidden="true"
              />
            )}
          </div>
        )}
        <div className="relative z-10 flex flex-col gap-4 p-8 text-[#6B7280]">
          {tag && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]/70">{tag}</span>}
          {title && <h3 className="text-title text-2xl leading-[130%] text-[#6B7280] md:text-3xl">{title}</h3>}
          <p className="text-base leading-relaxed text-[#6B7280]">{description}</p>
          {children && <div className="flex flex-col gap-3 text-[#6B7280]">{children}</div>}
          {showCta && (
            <Link
              href={href ?? '#'}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition-colors hover:text-primary-hover"
            >
              {ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </article>
    )
  }

  return (
    <article className={cn('flex h-full flex-col bg-white text-textcolor-primary', className)}>
      {imageSrc ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
          <Image
            src={imageSrc}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            className="object-cover"
            priority={false}
          />
        </div>
      ) : (
        icon && (
          <div className="bg-background-alt-secondary flex aspect-[4/5] w-full items-center justify-center rounded-[28px]">
            <div className="h-16 w-16 text-[var(--title-color)] [&>svg]:h-16 [&>svg]:w-16">{icon}</div>
          </div>
        )
      )}

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex flex-col gap-1.5">
          {tag && (
            <span className="text-textcolor-tertiary text-xs font-semibold uppercase tracking-[0.2em]">{tag}</span>
          )}
          {title && <h3 className="text-title text-xl leading-[130%]">{title}</h3>}
        </div>
        <p className="text-base leading-relaxed text-textcolor-secondary">{description}</p>
        {children && <div className="flex flex-col gap-3 text-textcolor-secondary">{children}</div>}
        {showCta && (
          <Link
            href={href ?? '#'}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-textcolor-primary transition-colors hover:text-primary-hover"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  )
}
