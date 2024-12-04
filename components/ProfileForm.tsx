'use client'

import { useRef, useState } from 'react'
import { z } from 'zod'

import { CustomInput } from './atoms'

//validation scheme
const profileSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
})

// derivation of types from Zod-schema
type ProfileFormValues = z.infer<typeof profileSchema>

const ProfileForm = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Partial<ProfileFormValues>>({})

  const handleSubmit = async () => {
    const formData = {
      name: nameRef.current?.value,
      lastName: lastNameRef.current?.value,
    }

    //data validation using profileSchema
    const result = profileSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<ProfileFormValues> = {}
      result.error.errors.forEach((error) => {
        const fieldName = error.path[0] as keyof ProfileFormValues
        fieldErrors[fieldName] = error.message
      })
      setErrors(fieldErrors)
      console.log(errors)
      return
    }

    setTimeout(() => {
      console.log('Data sent to the server', formData)
    }, 2000)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <CustomInput type="text" label="Name" placeholder="Enter your name" ref={nameRef} />
      <CustomInput type="text" label="Last Name" placeholder="Enter your last name" ref={lastNameRef} />
      {/* <CustomButton text="Send" onClick={handleSubmit} type="submit" /> */}
    </form>
  )
}

export default ProfileForm
