import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ds/shadcn/select'

interface DropdownInputProps {
  label: string
  labelIcon?: React.ReactNode
  defaultValue?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  items: { value: string; text: string }[]
  disabled?: boolean
}

export const DropdownInput = ({
  label,
  labelIcon,
  defaultValue,
  placeholder,
  onValueChange,
  items,
  disabled,
}: DropdownInputProps) => {
  return (
    <div className="flex flex-col-reverse">
      <Select disabled={disabled} defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger className="peer h-12 w-full rounded-md border-outline-secondary px-[14px] py-4 shadow-none outline-none ring-0 hover:border-primary-hover focus:ring-0 focus-visible:border-[3px] focus-visible:border-primary-focus disabled:border-disable disabled:text-disable data-[state='open']:border-primary data-[placeholder]:text-textcolor-tertiary [&_svg]:text-iconcolor-secondary [&_svg]:opacity-100 [&_svg]:hover:text-primary-hover [&_svg]:focus-visible:text-primary-focus [&_svg]:disabled:text-disable [&_svg]:data-[state=open]:rotate-180 [&_svg]:data-[state=open]:text-primary">
          <SelectValue placeholder={defaultValue ? defaultValue : placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-md border-outline-tertiary bg-surface-white shadow-none [&_>div]:p-0">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                className="rounded-none px-4 py-3 hover:cursor-pointer hover:bg-secondary-hover hover:text-textcolor-purple [&_svg]:hidden"
                key={item.value}
                value={item.value}
              >
                {item.text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div
        className={cn(
          "mb-2 text-sm/4 peer-focus-visible:text-primary-focus peer-disabled:text-disable peer-data-[state='open']:text-primary",
          labelIcon && 'mb-5 flex items-center gap-0.5 text-base'
        )}
      >
        {labelIcon}
        {label}
      </div>
    </div>
  )
}
