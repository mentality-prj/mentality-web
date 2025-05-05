import type { Meta, StoryObj } from '@storybook/react'

import { Label } from '@/ds/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/ds/shadcn/radio-group'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  argTypes: {},
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=40000540-49969&t=bhvL1yvvdaRkTpLP-1`,
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <RadioGroup defaultValue="checked" className="flex gap-5">
          <div className="flex space-x-2">
            <RadioGroupItem value="unchecked" id="r1" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r1">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <RadioGroupItem value="checked" id="r2" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r2">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="pseudo-hover-all">
        <RadioGroup defaultValue="checked" className="flex gap-5">
          <div className="flex space-x-2">
            <RadioGroupItem value="unchecked" id="r3" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r3">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <RadioGroupItem value="checked" id="r4" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r4">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="pseudo-focus-visible-all">
        <RadioGroup defaultValue="checked" className="flex gap-5">
          <div className="flex space-x-2">
            <RadioGroupItem value="unchecked" id="r5" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r5">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <RadioGroupItem value="checked" id="r6" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r6">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="pseudo-active-all">
        <RadioGroup defaultValue="checked" className="flex gap-5">
          <div className="flex space-x-2">
            <RadioGroupItem value="unchecked" id="r7" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r7">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <RadioGroupItem value="checked" id="r8" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r8">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div>
        <RadioGroup disabled defaultValue="checked" className="flex gap-5">
          <div className="flex space-x-2">
            <RadioGroupItem value="unchecked" id="r9" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r9">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <RadioGroupItem value="checked" id="r10" />
            <div className="flex flex-col gap-2">
              <Label className="text-base" htmlFor="r10">
                Label
              </Label>
              <span className="text-xs text-textcolor-tertiary">Addittional text</span>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
}
