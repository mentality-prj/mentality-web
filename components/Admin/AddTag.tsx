'use client'
import { Button, Input } from '@nextui-org/react'
import { useSession } from 'next-auth/react'

import { addTag } from '@/requests/tags'
import { CustomSession } from '@/types/auth'

export default function AddTag() {
  const { data } = useSession()
  const session = data as CustomSession

  const createTag = async (formData: FormData) => {
    const name = formData.get('name')
    if (session?.user && typeof name === 'string') {
      await addTag(session.user, name)
    }
    return
  }

  return (
    <form action={createTag} className="flex w-full gap-4">
      <Input
        key="add-tag"
        name="name"
        label="Add new tag:"
        labelPlacement="outside-left"
        description="Add the text for the new tag. This can be a word or phrase."
        type="text"
        className="w-full max-w-xl"
        classNames={{ mainWrapper: 'w-full' }}
      />
      <Button type="submit" className="flex-none" color="success">
        Add Tag
      </Button>
    </form>
  )
}
