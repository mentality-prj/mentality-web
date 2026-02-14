'use client'
import { Heart, Mail, Plus, Settings, Trash2 } from 'lucide-react'

import { Button } from '@/ds/shadcn/button'

export default function ButtonShowcase() {
  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Button Variants Showcase</h2>

      <div className="space-y-8">
        {/* Standard buttons with text */}
        <section>
          <h3 className="mb-4 text-lg font-semibold">Standard Variants</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Button variant="default">Default</Button>
              <span className="text-xs text-gray-500">variant=&quot;default&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="secondary">Secondary</Button>
              <span className="text-xs text-gray-500">variant=&quot;secondary&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost">Ghost</Button>
              <span className="text-xs text-gray-500">variant=&quot;ghost&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="destructive">Destructive</Button>
              <span className="text-xs text-gray-500">variant=&quot;destructive&quot;</span>
            </div>
          </div>
        </section>

        {/* Text-based buttons */}
        <section>
          <h3 className="mb-4 text-lg font-semibold">Text-based Variants</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Button variant="textIconButton">
                <Settings size={16} />
                Text with Icon
              </Button>
              <span className="text-xs text-gray-500">variant=&quot;textIconButton&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="textButton">Text Button</Button>
              <span className="text-xs text-gray-500">variant=&quot;textButton&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="linkButton">Link Button</Button>
              <span className="text-xs text-gray-500">variant=&quot;linkButton&quot;</span>
            </div>
          </div>
        </section>

        {/* Icon buttons */}
        <section>
          <h3 className="mb-4 text-lg font-semibold">Icon Variants</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <Button variant="iconButton" size="iconButton">
                <Heart size={20} />
              </Button>
              <span className="text-xs text-gray-500">variant=&quot;iconButton&quot;</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="iconButton" size="iconBig">
                <Mail size={24} />
              </Button>
              <span className="text-xs text-gray-500">size=&quot;iconBig&quot;</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="iconButton" size="icon">
                <Settings size={16} />
              </Button>
              <span className="text-xs text-gray-500">size=&quot;icon&quot;</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="iconButton" size="iconSm">
                <Plus size={12} />
              </Button>
              <span className="text-xs text-gray-500">size=&quot;iconSm&quot;</span>
            </div>
          </div>
        </section>

        {/* Special variants */}
        <section>
          <h3 className="mb-4 text-lg font-semibold">Special Variants</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Button variant="volume">Volume Button</Button>
              <span className="text-xs text-gray-500">variant=&quot;volume&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
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
          <h3 className="mb-4 text-lg font-semibold">Sizes</h3>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-2">
              <Button size="small">Small</Button>
              <span className="text-xs text-gray-500">size=&quot;small&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="medium">Medium</Button>
              <span className="text-xs text-gray-500">size=&quot;medium&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="default">Default</Button>
              <span className="text-xs text-gray-500">size=&quot;default&quot;</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="large">Large</Button>
              <span className="text-xs text-gray-500">size=&quot;large&quot;</span>
            </div>
          </div>
        </section>

        {/* Disabled states */}
        <section>
          <h3 className="mb-4 text-lg font-semibold">Disabled States</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Button variant="default" disabled>
                Default Disabled
              </Button>
              <span className="text-xs text-gray-500">disabled</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" disabled>
                Secondary Disabled
              </Button>
              <span className="text-xs text-gray-500">disabled</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="volume" disabled>
                <Trash2 size={16} />
                Volume Disabled
              </Button>
              <span className="text-xs text-gray-500">disabled (no gradient)</span>
            </div>
            <div className="flex flex-col gap-2">
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
