import * as React from 'react'

import { Label } from './label'
import { Textarea } from './textarea'

export function TextareaWithLabel(props: React.ComponentProps<typeof Textarea>) {
  return (
    <div>
      <div className="flex flex-col">
        <Label htmlFor="forTextarea">Label for Textarea</Label>
        <Textarea id="forTextarea" {...props} />
        <p className="mt-1 h-[14px] text-[12px] font-normal text-textcolor-tertiary">Helper text</p>
      </div>
    </div>
  )
}
export default TextareaWithLabel
