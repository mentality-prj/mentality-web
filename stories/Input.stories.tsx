import type { Meta, StoryObj } from '@storybook/react'

import { CustomInput } from '@/ds/components/CustomInput'

const baseUrl = process.env.STORYBOOK_FIGMA_URL

const meta = {
  title: 'Components/CustomInput',
  component: CustomInput,
  argTypes: {},
} satisfies Meta<typeof CustomInput>

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
    <div className="mx-auto flex w-full max-w-[400px] flex-col items-center justify-center gap-5">
      <div className="w-full">
        <CustomInput label="Label *" id="Default" placeholder="Type here" helperText="Helper text" />
      </div>
      <div className="pseudo-hover-all w-full">
        <CustomInput label="Label *" id="Hover" placeholder="Type here" helperText="Helper text" />
      </div>
      <div className="pseudo-focus-all pseudo-focus-visible-all w-full">
        <CustomInput label="Label *" id="Focus" placeholder="Type here" helperText="Helper text" />
      </div>
      <div className="w-full">
        <CustomInput
          defaultValue={'text'}
          label="Label *"
          id="Typing"
          placeholder="Type here"
          helperText="Helper text"
        />
      </div>
      <div className="w-full">
        <CustomInput
          errorMsg="Error message"
          label="Label *"
          id="Error"
          placeholder="Type here"
          helperText="Helper text"
        />
      </div>
      <div className="w-full">
        <CustomInput disabled label="Label *" id="Disabled" placeholder="Type here" helperText="Helper text" />
      </div>
    </div>
  ),
}
