import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../ds/shadcn/button'

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
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
      url: process.env.STORYBOOK_FIGMA_BUTTON_PRIMARY,
    },
  },
}

export const Primary_Hover: Story = {
  args: {
    children: 'Button',
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
    children: 'Button',
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
    children: 'Button',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: process.env.STORYBOOK_FIGMA_BUTTON_SECONDARY_HOVER,
    },
  },
}
