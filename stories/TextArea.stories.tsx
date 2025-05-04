import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Textarea } from '../ds/shadcn/textarea'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Message',
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1332-3396&t=G2Bre7mITQYTO7AJ-4`,
    },
  },

  render: (args) => {
    const ControlledTextarea = () => {
      const [value, setValue] = useState('')
      return (
        <div className="flex flex-col gap-10">
          <div>
            <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="pseudo-hover-all">
            <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="pseudo-focus-all pseudo-focus-visible-all">
            <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div>
            <Textarea required {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div>
            <Textarea disabled {...args} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </div>
      )
    }
    return <ControlledTextarea />
  },
}
