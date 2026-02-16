'use client'

import { Heart, Mail, Plus, Settings, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'

export function ButtonShowcase() {
  const t = useTranslations('components.Admin.ButtonShowcase')

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">{t('title')}</h2>

      <div className="space-y-8">
        {/* Standard buttons with text */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.standard')}</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-xs">
              <Button variant="default">Default</Button>
              <span className="text-xs text-gray-500">variant=&quot;default&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="secondary">Secondary</Button>
              <span className="text-xs text-gray-500">variant=&quot;secondary&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="ghost">Ghost</Button>
              <span className="text-xs text-gray-500">variant=&quot;ghost&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="destructive">Destructive</Button>
              <span className="text-xs text-gray-500">variant=&quot;destructive&quot;</span>
            </div>
          </div>
        </section>

        {/* Text-based buttons */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.textBased')}</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-xs">
              <Button variant="textIconButton">
                <Settings size={16} />
                Text with Icon
              </Button>
              <span className="text-xs text-gray-500">variant=&quot;textIconButton&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="textButton">Text Button</Button>
              <span className="text-xs text-gray-500">variant=&quot;textButton&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="linkButton">Link Button</Button>
              <span className="text-xs text-gray-500">variant=&quot;linkButton&quot;</span>
            </div>
          </div>
        </section>

        {/* Icon buttons */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.icon')}</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-center gap-xs">
              <Button variant="iconButton" size="iconButton">
                <Heart size={20} />
              </Button>
              <span className="text-xs text-gray-500">variant=&quot;iconButton&quot;</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Button variant="iconButton" size="iconBig">
                <Mail size={24} />
              </Button>
              <span className="text-xs text-gray-500">size=&quot;iconBig&quot;</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Button variant="iconButton" size="icon">
                <Settings size={16} />
              </Button>
              <span className="text-xs text-gray-500">size=&quot;icon&quot;</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Button variant="iconButton" size="iconSm">
                <Plus size={12} />
              </Button>
              <span className="text-xs text-gray-500">size=&quot;iconSm&quot;</span>
            </div>
          </div>
        </section>

        {/* Special variants */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.special')}</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-xs">
              <Button variant="volume">Volume Button</Button>
              <span className="text-xs text-gray-500">variant=&quot;volume&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="volume" size="large">
                <Plus size={20} />
                Large Volume
              </Button>
              <span className="text-xs text-gray-500">size=&quot;large&quot;</span>
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.sizes')}</h3>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-xs">
              <Button size="small">Small</Button>
              <span className="text-xs text-gray-500">size=&quot;small&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button size="medium">Medium</Button>
              <span className="text-xs text-gray-500">size=&quot;medium&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button size="default">Default</Button>
              <span className="text-xs text-gray-500">size=&quot;default&quot;</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button size="large">Large</Button>
              <span className="text-xs text-gray-500">size=&quot;large&quot;</span>
            </div>
          </div>
        </section>

        {/* Disabled states */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.disabled')}</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-xs">
              <Button variant="default" disabled>
                Default Disabled
              </Button>
              <span className="text-xs text-gray-500">disabled</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="secondary" disabled>
                Secondary Disabled
              </Button>
              <span className="text-xs text-gray-500">disabled</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="volume" disabled>
                <Trash2 size={16} />
                Volume Disabled
              </Button>
              <span className="text-xs text-gray-500">disabled (no gradient)</span>
            </div>
            <div className="flex flex-col gap-xs">
              <Button variant="iconButton" size="iconButton" disabled>
                <Settings size={20} />
              </Button>
              <span className="text-xs text-gray-500">icon disabled</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
