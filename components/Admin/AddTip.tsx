import { useState } from 'react'
import { Button, Textarea } from '@nextui-org/react'
import { useSession } from 'next-auth/react'

import { addTip, getUnpablishedTips } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Tip } from '@/types/tips'

export default function AddTip() {
  const [lang] = useState<SupportedLanguage>('uk')
  const [prompt, setPrompt] = useState('')
  const [tips, setTips] = useState([])

  const { data } = useSession()
  const session = data as CustomSession

  const generateTip = async () => {
    if (session?.user) {
      await addTip(session.user, prompt, lang)
    }
    return
  }

  const showUnpablishedTips = async () => {
    if (session?.user) {
      const data = await getUnpablishedTips(session.user)
      console.log('DATA: ', data)
      setTips(data)
    }
    return
  }

  const tipsMap = tips.map((tip: Tip) => {
    return <li key={tip.id}>{tip.translations.uk}</li>
  })

  return (
    <>
      <div className="flex w-full gap-4 px-4 py-6">
        <div className="flex flex-col gap-2">
          <Button color="success" onClick={generateTip}>
            Generate Tip
          </Button>
          <Button color="primary" onClick={showUnpablishedTips}>
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
        <Textarea label="Tip Prompt" placeholder="Add a prompt if needed" onValueChange={setPrompt} value={prompt} />
      </div>
      <ul>{tipsMap}</ul>
    </>
  )
}
