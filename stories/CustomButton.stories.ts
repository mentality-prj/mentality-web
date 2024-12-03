import { Meta, StoryObj } from '@storybook/react'

import CustomButton, { CustomButtonProps } from '@/components/atoms/CustomButton'

const meta: Meta<CustomButtonProps> = {
  title: 'Components/CustomButton',
  component: CustomButton,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'], // Доступні варіанти кольорів
      description: 'Колір кнопки',
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'hovered', 'pressed', 'disabled'], // Стан кнопки
      description: 'Стан кнопки',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'], // Варіанти розміру
      description: 'Розмір кнопки',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Чи вимкнена кнопка',
    },
    children: {
      control: { type: 'text' },
      description: 'Текст або контент кнопки',
    },
  },
}

export default meta

type Story = StoryObj<CustomButtonProps>

export const Primary: Story = {
  args: {
    variant: 'primary',
    state: 'default',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    state: 'hovered',
    disabled: false,
    children: 'Secondary Button',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    state: 'disabled',
    size: 'sm',
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Pressed: Story = {
  args: {
    variant: 'primary',
    state: 'pressed',
    size: 'md',
    disabled: false,
    children: 'Pressed Button',
  },
}
