import { forwardRef } from 'react'
import { Input, InputProps } from '@nextui-org/react'

interface CustomInputProps extends InputProps {
  type?: string
  label?: string
  placeholder?: string
  className?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ type, label, placeholder, className, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2`}>
        <Input
          ref={ref}
          type={type}
          label={label}
          placeholder={placeholder}
          labelPlacement="outside"
          className={`${className} w-full rounded-md border-2 border-primary hover:border-primary-hover sm:w-1/3 md:w-1/4`}
          {...props}
        />
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'

export default CustomInput
