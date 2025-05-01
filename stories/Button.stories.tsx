import type { Meta, StoryObj } from '@storybook/react'
import { CircleCheck } from 'lucide-react'

import { CheckIcon } from '@/ds/icons/check'
import { Button } from '@/ds/shadcn/button'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=1254-3923&t=z5Hqhrd1Pa9VCgjv-1`,
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <Button>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-hover-all">
        <Button>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all">
        <Button>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-active-all">
        <Button>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div>
        <Button disabled>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
    </div>
  ),
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=40000741-25311&t=z5Hqhrd1Pa9VCgjv-1`,
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-hover-all">
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all">
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-active-all">
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div>
        <Button disabled variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
    </div>
  ),
}

export const TextIconButton: Story = {
  args: {
    variant: 'textIconButton',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=40000741-25343&t=z5Hqhrd1Pa9VCgjv-1`,
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-hover-all">
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all">
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div className="pseudo-active-all">
        <Button variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
      <div>
        <Button disabled variant={args.variant}>
          <CircleCheck />
          Button
          <CircleCheck />
        </Button>
      </div>
    </div>
  ),
}

export const TextButton: Story = {
  args: {
    variant: 'textButton',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=40000741-25345&t=z5Hqhrd1Pa9VCgjv-1`,
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <Button variant={args.variant}>Button</Button>
      </div>
      <div className="pseudo-hover-all">
        <Button variant={args.variant}>Button</Button>
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all">
        <Button variant={args.variant}>Button</Button>
      </div>
      <div className="pseudo-active-all">
        <Button variant={args.variant}>Button</Button>
      </div>
      <div>
        <Button disabled variant={args.variant}>
          Button
        </Button>
      </div>
    </div>
  ),
}

export const LinkButton: Story = {
  args: {
    variant: 'linkButton',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=40000741-25347&t=z5Hqhrd1Pa9VCgjv-1`,
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <Button variant={args.variant}>Link</Button>
      </div>
      <div className="pseudo-hover-all">
        <Button variant={args.variant}>Link</Button>
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all">
        <Button variant={args.variant}>Link</Button>
      </div>
      <div className="pseudo-active-all">
        <Button variant={args.variant}>Link</Button>
      </div>
      <div>
        <Button disabled variant={args.variant}>
          Link
        </Button>
      </div>
    </div>
  ),
}

export const IconButton: Story = {
  args: {
    variant: 'IconButton',
    size: 'icon',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=40000741-25358&t=z5Hqhrd1Pa9VCgjv-1`,
      //https://www.figma.com/design/xpfA8bAnF0wECi27CmSdXM/mentality_copy?
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div className="pseudo-hover-all">
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all">
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div className="pseudo-active-all">
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div>
        <Button disabled variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
    </div>
  ),
}

export const IconButtonSmall: Story = {
  args: {
    variant: 'IconButton',
    size: 'iconSm',
  },
  parameters: {
    design: {
      type: 'figspec',
      url: `${baseUrl}?node-id=40000741-25360&t=z5Hqhrd1Pa9VCgjv-1`,
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div className="pseudo-hover-all">
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all">
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div className="pseudo-active-all">
        <Button variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
      <div>
        <Button disabled variant={args.variant} size={args.size}>
          <CheckIcon />
        </Button>
      </div>
    </div>
  ),
}
