import { Button, Input } from '@nextui-org/react'

import { addTag } from '@/requests/tags'

export default function Dashboard() {
  const createTag = async (formData: FormData) => {
    'use server'
    const name = formData.get('name')
    if (typeof name === 'string') {
      await addTag(name)
    }

    return
  }
  return (
    <form action={createTag}>
      <Input name="name" />
      <Button type="submit">Add tag</Button>
    </form>
  )
}
