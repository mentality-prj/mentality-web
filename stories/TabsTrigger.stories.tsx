import type { Meta, StoryObj } from '@storybook/react'

import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta = {
  title: 'Components/Tabs/TabsTrigger',
  component: TabsTrigger,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary'],
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof TabsTrigger>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    value: 'active',
    variant: 'default',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1608-1292&t=1udyO4HGgx3kGSrW-1`,
    },
  },
  render: (args) => (
    <Tabs defaultValue={args.value} activationMode="manual">
      <TabsList className="flex flex-col gap-5">
        <div>
          <TabsTrigger value="default">Tab</TabsTrigger>
        </div>
        <div>
          <TabsTrigger value="active">Tab</TabsTrigger>
        </div>
        <div className="pseudo-hover-all">
          <TabsTrigger value="hover">Tab</TabsTrigger>
        </div>
        <div className="pseudo-focus-visible-all">
          <TabsTrigger value="focus">Tab</TabsTrigger>
        </div>
        <div className="pseudo-active-all">
          <TabsTrigger value="pressed">Tab</TabsTrigger>
        </div>
      </TabsList>
    </Tabs>
  ),
}

export const Secondary: Story = {
  args: {
    value: 'active',
    variant: 'secondary',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1608-1357&t=KZCzR6HlCus334Ha-1`,
    },
  },
  render: (args) => (
    <Tabs defaultValue={args.value} activationMode="manual">
      <TabsList className="flex flex-col gap-10">
        <div>
          <TabsTrigger value="default" variant={args.variant}>
            Tab
          </TabsTrigger>
        </div>
        <div>
          <TabsTrigger value="active" variant={args.variant}>
            Tab
          </TabsTrigger>
        </div>
        <div className="pseudo-hover-all">
          <TabsTrigger value="hover" variant={args.variant}>
            Tab
          </TabsTrigger>
        </div>
        <div className="pseudo-focus-visible-all">
          <TabsTrigger value="focus" variant={args.variant}>
            Tab
          </TabsTrigger>
        </div>
        <div className="pseudo-active-all">
          <TabsTrigger value="pressed" variant={args.variant}>
            Tab
          </TabsTrigger>
        </div>
      </TabsList>
    </Tabs>
  ),
}
