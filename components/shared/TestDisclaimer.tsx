import { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'

import Card from './Cards/Card'

interface TestDisclaimerProps {
  text: ReactNode
}

export function TestDisclaimer({ text }: TestDisclaimerProps) {
  return (
    <Card type="note">
      <div className="flex flex-row items-start gap-xs text-sm">
        <div className="h-8 w-8 shrink-0">
          <CircleAlert size={32} className="text-white opacity-50" />
        </div>
        <div className="whitespace-pre-line">{text}</div>
      </div>
    </Card>
  )
}
