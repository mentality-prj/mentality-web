import { QuestionTypes } from '@/components/TestsQuestionnarie/typesTestPage'
import { Checkbox } from '@/ds/shadcn/checkbox'
import { Label } from '@/ds/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/ds/shadcn/radio-group'

interface Props {
  data: QuestionTypes
  index: number
  type: 'radio' | 'checkbox'
  selectedValue?: number
}

export default function Question({ data, index, type, selectedValue }: Props) {
  return (
    <div>
      {type === 'radio' && data.options && (
        <div className="p-2">
          <p className="mb-2 font-medium">
            {index + 1}. {data.text}
          </p>
          <RadioGroup
            value={String(selectedValue)}
            // onValueChange={(value) => onChange(Number(value))}
          >
            {data.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <RadioGroupItem value={String(opt.value)} id={`question-${index}-option-${opt.value}`} />
                <Label htmlFor={`question-${index}-option-${opt.value}`}>{opt.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {type === 'checkbox' && (
        <div className="flex items-center gap-3">
          <Checkbox />
          <Label className="mt-2 flex items-center gap-2">{data.text}</Label>
        </div>
      )}
    </div>
  )
}
