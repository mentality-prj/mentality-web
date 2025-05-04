import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { TextareaWithLabel } from '../ds/shadcn/textarea-with-label'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta: Meta<typeof TextareaWithLabel> = {
  title: 'Components/TextareaWithLabel',
  component: TextareaWithLabel,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Message',
  },
}

export default meta
type Story = StoryObj<typeof TextareaWithLabel>

export const Default: Story = {
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1332-3396&t=G2Bre7mITQYTO7AJ-4`,
    },
  },

  render: (args) => {
    const ControlledTextareaWithLabel = () => {
      const [value, setValue] = useState('')
      return (
        <div className="flex flex-col gap-10">
          <div>
            <TextareaWithLabel {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="pseudo-hover-all">
            <TextareaWithLabel {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="pseudo-focus-all pseudo-focus-visible-all">
            <TextareaWithLabel {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div>
            <TextareaWithLabel required {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div>
            <TextareaWithLabel disabled {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </div>
      )
    }
    return <ControlledTextareaWithLabel />
  },
}
