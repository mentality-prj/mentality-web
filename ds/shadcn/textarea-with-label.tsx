import { ComponentProps } from 'react'

import { Label } from './label'
import { Textarea } from './textarea'

type Props = ComponentProps<typeof Textarea> & {
  label?: string
  helper?: string
}

export function TextareaWithLabel({ label, helper, id = 'textarea', ...props }: Props) {
  return (
    <div className="flex flex-col">
      {label && <Label htmlFor={id}> {label} </Label>}
      <Textarea id={id} {...props}></Textarea>
      {helper && <p className="mt-1 h-[14px] text-[12px] font-normal text-textcolor-tertiary">{helper}</p>}
    </div>
  )
}
export default TextareaWithLabel
