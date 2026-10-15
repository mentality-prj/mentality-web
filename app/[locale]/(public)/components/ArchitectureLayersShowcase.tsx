'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, BrainCircuit, Layers3, Route } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { MosaicGrid, MosaicGridItem } from '@/components/shared/Content/MosaicGrid'
import { cn } from '@/lib/utils'

type ArchitectureLayerKey = 'core' | 'b2c' | 'loop'
type LayerRole = 'active' | 'right' | 'left'

type ArchitectureLayerConfig = {
  key: ArchitectureLayerKey
  icon: LucideIcon
  chipActiveClassName: string
  panelClassName: string
  shadowClassName: string
  iconAccentClassName: string
  arrowClassName: string
}

function getIconRoleClass(role: LayerRole) {
  switch (role) {
    case 'active':
      return 'rotate-0'
    case 'right':
      return '-rotate-[8deg]'
    case 'left':
      return 'rotate-[8deg]'
  }
}

function getLayerRoleClass(role: LayerRole) {
  switch (role) {
    case 'active':
      return 'z-30 translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100 lg:shadow-[0_28px_80px_rgba(15,23,42,0.14)]'
    case 'right':
      return 'z-20 translate-x-[18%] translate-y-8 rotate-[8deg] lg:scale-[0.9] opacity-100 lg:shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:translate-x-[20%] md:translate-y-10'
    case 'left':
      return 'z-10 -translate-x-[18%] translate-y-10 -rotate-[8deg] lg:scale-[0.9] opacity-100 lg:shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:-translate-x-[14%] md:translate-y-12'
  }
}

const layerConfigs: readonly ArchitectureLayerConfig[] = [
  {
    key: 'core',
    icon: BrainCircuit,
    chipActiveClassName: 'border-[#b8cb72]/45 bg-[#f4f8df] text-[#5f711b]',
    panelClassName: 'bg-[linear-gradient(145deg,rgba(215,230,168,0.96),rgba(204,223,148,0.9))]',
    shadowClassName: 'bg-[#d7e6a8]/55',
    iconAccentClassName:
      'pointer-events-none absolute -bottom-20 -left-16 z-0 h-80 w-80 text-[#d9e7ae] md:-bottom-24 md:-left-20 md:h-[25rem] md:w-[25rem]',
    arrowClassName: 'text-[#5f711b]',
  },
  {
    key: 'b2c',
    icon: Route,
    chipActiveClassName: 'border-[#92bee8]/45 bg-[#eef6fe] text-[#2f668f]',
    panelClassName: 'bg-[linear-gradient(145deg,rgba(167,203,238,0.96),rgba(148,191,232,0.9))]',
    shadowClassName: 'bg-[#a7cbee]/55',
    iconAccentClassName:
      'pointer-events-none absolute -bottom-20 -left-16 z-0 h-80 w-80 text-[#c7ddf4] md:-bottom-24 md:-left-20 md:h-[25rem] md:w-[25rem]',
    arrowClassName: 'text-[#2f668f]',
  },
  {
    key: 'loop',
    icon: Layers3,
    chipActiveClassName: 'border-[#9fe1b7]/45 bg-[#edfdf2] text-[#2a6f4d]',
    panelClassName: 'bg-[linear-gradient(145deg,rgba(184,241,203,0.96),rgba(167,233,187,0.9))]',
    shadowClassName: 'bg-[#b8f1cb]/55',
    iconAccentClassName:
      'pointer-events-none absolute -bottom-20 -left-16 z-0 h-80 w-80 text-[#cff3d9] md:-bottom-24 md:-left-20 md:h-[25rem] md:w-[25rem]',
    arrowClassName: 'text-[#2a6f4d]',
  },
] as const

function getNextIndex(index: number) {
  return (index + 1) % layerConfigs.length
}

function getLayerRole(index: number, activeIndex: number): LayerRole {
  const offset = (index - activeIndex + layerConfigs.length) % layerConfigs.length

  if (offset === 0) {
    return 'active'
  }

  if (offset === 1) {
    return 'right'
  }

  return 'left'
}

export function ArchitectureLayersShowcase() {
  const t = useTranslations('pages.About')
  const [activeIndex, setActiveIndex] = useState(0)

  const activeLayer = layerConfigs[activeIndex as number] ?? layerConfigs[0]

  const handleCardClick = (index: number) => {
    setActiveIndex((currentIndex) => (currentIndex === index ? getNextIndex(currentIndex) : index))
  }

  return (
    <MosaicGrid className="gap-y-4 xl:gap-x-8">
      <MosaicGridItem xlSpan={4}>
        <div className="landing-outline-panel flex h-full flex-col rounded-[28px] p-6 md:p-8">
          <div className="space-y-5">
            <p className="landing-section-eyebrow">{t('Architecture.title')}</p>
            <h2 className="landing-section-title">{t('Architecture.overviewTitle')}</h2>
            <p className="text-sm leading-relaxed text-textcolor-secondary md:text-base">
              {t('Architecture.overviewDescriptionLead')}
            </p>
            <p className="text-sm leading-relaxed text-textcolor-secondary md:text-base">
              {t('Architecture.overviewDescriptionFollowup')}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {layerConfigs.map((layer, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={layer.key}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300',
                    isActive
                      ? cn(layer.chipActiveClassName, 'shadow-[0_12px_24px_rgba(15,23,42,0.08)]')
                      : 'border-transparent bg-white/65 text-textcolor-secondary hover:border-black/[0.08] hover:bg-white'
                  )}
                >
                  {t(`Architecture.${layer.key}.title`)}
                </button>
              )
            })}
          </div>
        </div>
      </MosaicGridItem>

      <MosaicGridItem xlSpan={8}>
        <div className="relative h-full min-h-[360px] overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(248,250,252,0.86)_45%,rgba(241,245,249,0.92)_100%)] p-3 [perspective:1800px] md:min-h-[520px] md:p-6">
          <div
            className={cn(
              'absolute inset-[12%] hidden rounded-[36px] transition-colors duration-500 lg:block lg:blur-3xl',
              activeLayer.shadowClassName
            )}
          />

          {layerConfigs.map((layer, index) => {
            const LayerIcon = layer.icon
            const isActive = index === activeIndex
            const role = getLayerRole(index, activeIndex)

            return (
              <button
                key={layer.key}
                type="button"
                onClick={() => handleCardClick(index)}
                aria-pressed={isActive}
                aria-label={
                  isActive
                    ? `${t(`Architecture.${layer.key}.title`)}, ${t('Architecture.nextAction')}`
                    : t(`Architecture.${layer.key}.title`)
                }
                className={cn(
                  'group absolute inset-x-4 inset-y-5 flex origin-center transform-gpu flex-col overflow-hidden rounded-[30px] border border-white/85 p-5 text-left transition-[transform,opacity] duration-500 ease-out md:inset-x-10 md:inset-y-8 md:p-8',
                  layer.panelClassName,
                  getLayerRoleClass(role),
                  isActive
                    ? 'cursor-pointer [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105'
                    : 'cursor-pointer [@media(hover:hover)_and_(pointer:fine)]:saturate-[0.88] [@media(hover:hover)_and_(pointer:fine)]:hover:saturate-100'
                )}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_45%,rgba(15,23,42,0.04))]" />
                <LayerIcon className={cn(layer.iconAccentClassName, getIconRoleClass(role))} />

                <div className="relative z-10 flex items-start justify-end gap-3">
                  <span className="text-3xl font-semibold leading-none tracking-[0.08em] text-white drop-shadow-[0_2px_10px_rgba(15,23,42,0.16)] md:text-4xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="relative z-10 space-y-3 lg:mt-6">
                  <h3 className={cn('landing-showcase-title landing-showcase-title-active')}>
                    {t(`Architecture.${layer.key}.title`)}
                  </h3>

                  <p
                    aria-hidden={!isActive}
                    className={cn(
                      'max-w-[34rem] overflow-hidden text-base leading-relaxed text-textcolor-secondary transition-[opacity,transform] duration-300 md:text-lg',
                      isActive ? 'mt-4 scale-y-100 opacity-100' : 'pointer-events-none mt-0 scale-y-95 opacity-0'
                    )}
                    style={{ transformOrigin: 'top' }}
                  >
                    {t(`Architecture.${layer.key}.description`)}
                  </p>
                </div>

                <div className="relative z-10 mt-auto flex items-end justify-end gap-4 lg:pt-6">
                  <ArrowRight
                    className={cn(
                      'h-[3rem] w-[3rem] flex-none transition-[transform] duration-300 tablet:h-[3.75rem] tablet:w-[3.75rem]',
                      layer.arrowClassName,
                      isActive
                        ? 'translate-x-0 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-125 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-125'
                        : 'translate-x-1'
                    )}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </MosaicGridItem>
    </MosaicGrid>
  )
}
