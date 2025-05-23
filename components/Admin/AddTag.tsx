'use client'

import { useSession } from 'next-auth/react'

import { tagproperties } from '@/constants/tags'
import { Button } from '@/ds/shadcn/button'
import { Input } from '@/ds/shadcn/input'
import { Label } from '@/ds/shadcn/label'
import { addTag } from '@/requests/tags'
import { CustomSession } from '@/types/auth'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/types/languages'
import { TagProperties } from '@/types/tags'

export default function AddTag() {
  const { data } = useSession()
  const session = data as CustomSession

  const createTag = async (formData: FormData) => {
    const translations = SUPPORTED_LANGUAGES.reduce(
      (acc, lang) => {
        acc[`${lang}`] = formData.get(lang) as string
        return acc
      },
      {} as Record<SupportedLanguage, string>
    )
    const tag = { key: formData.get('key') as string, translations }

    if (session?.user) {
      await addTag(session.user, tag)
    }
    return
  }

  const tagPropertiesMap = tagproperties.map((prop: TagProperties) => (
    <div key={prop.key}>
      <Label htmlFor={prop.key}>{prop.label}</Label>
      <Input required id={prop.key} name={prop.name} type="text" className="w-full max-w-xl" />
      <span>{prop.description}</span>
    </div>
  ))

  return (
    <form action={createTag} className="flex w-full flex-col items-center gap-4 py-6">
      <h2>Add a new tag</h2>
      {tagPropertiesMap}
      <div>
        <Button type="submit" className="flex-none" color="success">
          Add Tag
        </Button>
      </div>
    </form>
  )
}
