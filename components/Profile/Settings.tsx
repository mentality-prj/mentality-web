'use client'
import { useState } from 'react'
import { z } from 'zod'

import { Button, CardContent, CardDescription, CardHeader, CardTitle } from '@/ds/shadcn'
import { CustomUser } from '@/types/auth'

import { FormInput } from '../ui/forms/FormInput'

interface SettingProps {
  user: CustomUser
}

const formSchema = z.object({
  name: z.string().min(3, 'Name must contain at least 3 characters'),
  surname: z.string().min(3, 'Surname must contain at least 3 characters'),
  email: z.string().email(),
})

export default function Settings({ user }: SettingProps) {
  const [firstName, lastName] = user.name!.split(' ')

  const initialForm = {
    name: firstName,
    surname: lastName,
    email: user.email!,
  }

  const [form, setForm] = useState(initialForm)
  const [showErrors, setShowErrors] = useState(false)

  const isDirty =
    form.name !== initialForm.name || form.surname !== initialForm.surname || form.email !== initialForm.email
  const resetForm = () => {
    setForm(initialForm)
  }

  const validate = () => {
    const res = formSchema.safeParse(form)
    return res.success ? null : res.error.format()
  }
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors = validate()
    if (errors) {
      setShowErrors(true)
    } else {
      console.log('fetch')
      // logic to update profile
    }
  }
  const errors = showErrors ? validate() : undefined
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 border-b pb-5">
          <h4 className="font-medium">Personal information</h4>
          <CardDescription>Update your personal information here.</CardDescription>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-wrap gap-x-5 gap-y-6 border-b py-6">
            <FormInput
              name="Name"
              value={form.name}
              onChangeValue={(val) => handleChange('name', val)}
              wrapperClassName="max-w-[360px]"
              error={errors?.name?._errors[0]}
            />
            <FormInput
              name="Surname"
              value={form.surname}
              onChangeValue={(val) => handleChange('surname', val)}
              wrapperClassName="max-w-[360px]"
              error={errors?.surname?._errors[0]}
            />
            <FormInput
              name="Email address"
              value={form.email}
              onChangeValue={(val) => handleChange('email', val)}
              wrapperClassName="max-w-[360px]"
              error={errors?.email?._errors[0]}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              onClick={resetForm}
              variant="secondary"
              disabled={!isDirty}
              className="h-12 rounded-[80px] px-8 py-0"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty || !!errors} className="h-12 rounded-[80px] px-8 py-0">
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  )
}
