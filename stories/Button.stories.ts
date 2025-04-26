import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../ds/shadcn/button'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {},
  argTypes: {},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1254-3922&t=gzzgbK6Aad46oXFw-4`,
    },
  },
}

export const Primary_Hover: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1254-3917&t=gzzgbK6Aad46oXFw-4`,
    },
  },
}
