import { ErrorIcon } from '@/ds/icons/errorIcon'
import { Input, Label } from '@/ds/shadcn'
import { cn } from '@/lib/utils'

interface FormInputProps {
  name: string
  value: string
  onChangeValue: (value: string) => void
  wrapperClassName?: string
  labelClassName?: string
  inputClassName?: string
  required?: boolean
  description?: string
  error: string | undefined
}

export const FormInput = ({
  wrapperClassName,
  name,
  value,
  onChangeValue,
  required = true,
  labelClassName,
  inputClassName,
  error,
  description,
}: FormInputProps) => {
  return (
    <div className={cn(`flex w-full flex-col ${!error ? 'focus-within:text-primary' : ''}`, wrapperClassName)}>
      <Label htmlFor={name} required={required} className={cn('transition-colors', labelClassName)}>
        {name}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        id={name}
        name={name}
        className={cn(`mt-2 ${error ? 'border-red-50' : ''}`, inputClassName)}
      />
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs font-normal leading-none text-red-30">
          <ErrorIcon />
          {error}
        </div>
      )}
      {description && !error && <p className="mt-1 text-xs font-normal leading-none text-gray-30">{description}</p>}
    </div>
  )
}
