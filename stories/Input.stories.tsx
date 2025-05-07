import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '@/ds/shadcn/input'
import { Label } from '@/ds/shadcn/label'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta = {
  title: 'Components/Input',
  component: Input,
  argTypes: {},
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1255-30603&t=yFuKSMWobs6u408D-1`,
    },
  },
  render: () => (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="flex w-full max-w-[360px] flex-col gap-2">
        <Label htmlFor="Label1">Label *</Label>
        <Input id="Label1" placeholder="Type here" helperText="Helper text" errorMsg="" />
      </div>
      <div className="pseudo-hover-all w-full max-w-[360px]">
        <Label htmlFor="Label2">Label *</Label>
        <Input id="Label2" placeholder="Type here" helperText="Helper text" errorMsg="" />
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all w-full max-w-[360px]">
        <Label htmlFor="Label3">Label *</Label>
        <Input id="Label3" placeholder="Type here" helperText="Helper text" errorMsg="" />
      </div>
      <div className="flex w-full max-w-[360px] flex-col gap-2">
        <Label htmlFor="Label4">Label *</Label>
        <Input defaultValue={'text'} id="Label4" placeholder="Type here" helperText="Helper text" errorMsg="" />
      </div>
      <div className="flex w-full max-w-[360px] flex-col gap-2">
        <Label htmlFor="Label5">Label *</Label>
        <Input id="Label5" placeholder="Type here" helperText="Helper text" errorMsg="Error message" />
      </div>
      <div className="flex w-full max-w-[360px] flex-col gap-2">
        <Label htmlFor="Label6">Label *</Label>
        <Input disabled id="Label6" placeholder="Type here" helperText="Helper text" />
      </div>
    </div>
  ),
}
