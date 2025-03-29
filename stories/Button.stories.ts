import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from './Button'

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: process.env.STORYBOOK_FIGMA_BUTTON_PRIMARY,
    },
  },
}

export const Primary_Hover: Story = {
  args: {
    label: 'Button',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: process.env.STORYBOOK_FIGMA_BUTTON_PRIMARY_HOVER,
    },
  },
}

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: process.env.STORYBOOK_FIGMA_BUTTON_SECONDARY,
    },
  },
}

export const Secondary_Hover: Story = {
  args: {
    label: 'Button',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: process.env.STORYBOOK_FIGMA_BUTTON_SECONDARY_HOVER,
    },
  },
}
