import { forwardRef } from 'react'
import { Input, InputProps } from '@nextui-org/react'

interface CustomInputProps extends InputProps {
  type?: string
  label?: string
  placeholder?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ type, label, placeholder }, ref) => {
  return (
    <div>
      <Input ref={ref} type={type} label={label} placeholder={placeholder} labelPlacement="outside" />
    </div>
  )
})

CustomInput.displayName = 'CustomInput'

export default CustomInput
