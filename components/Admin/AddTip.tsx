import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addTip, getUnpublishedTips } from '@/requests/tips'
import { TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'

export default function AddTip() {
  const [lang] = useState<SupportedLanguage>('uk')
  const [prompt, setPrompt] = useState('')
  const [tips, setTips] = useState<TipEntity[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useSession()
  const session = data as CustomSession

  const generateTip = async () => {
    if (session?.user) {
      setIsLoading(true)
      try {
        await addTip(session, prompt, lang)
      } finally {
        setIsLoading(false)
      }
    }
    return
  }

  const showUnpablishedTips = async () => {
    if (session?.user) {
      setIsLoading(true)
      try {
        const result = await getUnpublishedTips(session)
        if (result.data) {
          setTips(result.data)
        }
      } finally {
        setIsLoading(false)
      }
    }
    return
  }

  const tipsMap = tips.map((tip: TipEntity) => {
    return <li key={tip.id}>{tip.text.uk}</li>
  })

  return (
    <>
      <div className="flex w-full gap-4 px-4 py-6">
        <div className="flex flex-col gap-2">
          <Button color="success" onClick={generateTip} disabled={isLoading}>
            Generate Tip
          </Button>
          <Button color="primary" onClick={showUnpablishedTips} disabled={isLoading}>
            Show Unpablished
          </Button>
        </div>
        <p className="text-sm">
          Generate a <strong>Tip</strong> using the OpenAI service.
          <br />
          This tip will automatically appear on pages as a <strong>Current Tip</strong>
          <br />
          <em>If no prompt is specified, the tip will be generated with the default prompt.</em>
        </p>
      </div>
      <div className="flex w-full gap-4 px-4 py-6">
        <em>
          Генерація поради підтримує лише <strong>українську мову</strong>
        </em>
        <Label htmlFor="tipPrompt">Tip Prompt</Label>
        <Textarea
          id="tipPrompt"
          placeholder="Add a prompt if needed"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          disabled={isLoading}
        />
      </div>
      <ul>{tipsMap}</ul>
    </>
  )
}
