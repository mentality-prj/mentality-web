import { Label } from '@/ds/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/ds/shadcn/radio-group'

type DaysFilterValue = 'with' | 'without'

type DaysFilterProps = {
  value: DaysFilterValue
  onChange: (value: DaysFilterValue) => void
  className?: string
}

export const DaysFilter = ({ value, onChange, className }: DaysFilterProps) => {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as DaysFilterValue)} className={className}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="with" id="with" />
        <Label htmlFor="with">дні з записами (додати i18n)</Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="without" id="without" />
        <Label htmlFor="without">дні без записів</Label>
      </div>
    </RadioGroup>
  )
}
