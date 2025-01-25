import { useState } from 'react'
import { Button, Textarea } from '@nextui-org/react'
import { useSession } from 'next-auth/react'

import { addTip } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'

export default function AddTip() {
  const [lang] = useState<SupportedLanguage>('uk')
  const [prompt, setPrompt] = useState('')

  const { data } = useSession()
  const session = data as CustomSession

  const generateTip = async () => {
    if (session?.user) {
      await addTip(session.user, prompt, lang)
    }
    return
  }

  return (
    <>
      <div className="flex w-full gap-4 px-4 py-6">
        <Button color="success" onClick={generateTip}>
          Generate Tip
        </Button>
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
        <Textarea label="Tip Prompt" placeholder="Add a prompt if needed" onValueChange={setPrompt} value={prompt} />
      </div>
    </>
  )
}
