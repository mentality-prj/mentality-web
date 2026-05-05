import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { cn } from '@/lib/utils'

interface DropdownInputProps {
  id: string
  label: string
  labelIcon?: React.ReactNode
  defaultValue?: string
  value?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  items: { value: string; text: string }[] //The value is also used as a key, so it must be unique.
  disabled?: boolean
}

export const DropdownInput = ({
  id,
  label,
  labelIcon,
  defaultValue,
  value,
  placeholder,
  onValueChange,
  items,
  disabled,
}: DropdownInputProps) => {
  return (
    <div className="flex flex-col-reverse">
      <Select disabled={disabled} defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className="border-outline-secondary disabled:border-disable disabled:text-disable data-[placeholder]:text-textcolor-tertiary [&_svg]:text-iconcolor-secondary [&_svg]:disabled:text-disable peer h-12 w-full rounded-md px-[14px] py-4 shadow-none outline-none ring-0 hover:border-primary-hover focus:ring-0 focus-visible:border-[3px] focus-visible:border-primary-focus data-[state='open']:border-primary [&_svg]:opacity-100 [&_svg]:hover:text-primary-hover [&_svg]:focus-visible:text-primary-focus [&_svg]:data-[state=open]:rotate-180 [&_svg]:data-[state=open]:text-primary"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-outline-tertiary rounded-md bg-white shadow-none [&_>div]:p-0">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                className="hover:text-textcolor-purple rounded-none bg-white px-4 py-3 hover:cursor-pointer hover:bg-secondary-hover [&_svg]:hidden"
                key={item.value}
                value={item.value}
              >
                {item.text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <label
        className={cn(
          "peer-disabled:text-disable mb-2 text-sm/4 peer-focus-visible:text-primary-focus peer-data-[state='open']:text-primary",
          labelIcon && 'mb-5 flex items-center gap-0.5 text-base'
        )}
        htmlFor={id}
      >
        {labelIcon}
        {label}
      </label>
    </div>
  )
}
