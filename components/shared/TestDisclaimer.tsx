import { CircleAlert } from 'lucide-react'

import Card from './Cards/Card'

interface TestDisclaimerProps {
  text: string
}

export function TestDisclaimer({ text }: TestDisclaimerProps) {
  return (
    <Card type="note">
      <div className="flex flex-row items-center gap-xs text-sm">
        <CircleAlert size={32} className="text-white opacity-50" />
        {text}
      </div>
    </Card>
  )
}
