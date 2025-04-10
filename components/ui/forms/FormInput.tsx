import { Input, Label } from '@/ds/shadcn'
import { cn } from '@/lib/utils'

import { ErrorMessage } from './ErrorMessage'

interface FormInputProps {
  name: string
  value: string
  label: string
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
  label,
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
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        id={name}
        name={name}
        className={cn(`mt-2 ${error ? 'border-red-50' : ''}`, inputClassName)}
        data-testid={`input-${name}`}
      />
      {error && <ErrorMessage message={error} />}
      {description && !error && <p className="mt-1 text-xs font-normal leading-none text-gray-30">{description}</p>}
    </div>
  )
}
