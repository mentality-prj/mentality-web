import { ComponentProps } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import CustomInput from '@/components/atoms/CustomInput'

type StoryProps = ComponentProps<typeof CustomInput>

const meta: Meta<StoryProps> = {
  title: 'Components/CustomInput', // Назва для Storybook
  component: CustomInput, // Компонент
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Мітка поля вводу',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Підказка в полі вводу',
    },
    className: {
      control: { type: 'text' },
      description: 'Додаткові CSS-класи',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Чи вимкнене поле вводу',
    },
  },
}

export default meta

type Story = StoryObj<StoryProps>

// Базовий приклад
export const Default: Story = {
  args: {
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
    className: '',
    disabled: false,
  },
}

// Поле з паролем
export const Password: Story = {
  args: {
    type: 'password',
    label: 'Password Label',
    placeholder: 'Enter your password...',
    className: '',
    disabled: false,
  },
}

// Disabled поле
export const Disabled: Story = {
  args: {
    type: 'text',
    label: 'Disabled Label',
    placeholder: 'This input is disabled',
    className: '',
    disabled: true,
  },
}

// Поле для email
export const Email: Story = {
  args: {
    type: 'email',
    label: 'Email Label',
    placeholder: 'Enter your email...',
    className: '',
    disabled: false,
  },
}
