'use client'
import React, { useRef } from 'react'

import { CustomButton, CustomInput } from '@/components/atoms'

export default function ForTestingPage() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  return (
    <div>
      <CustomInput ref={inputRef} type="text" label="User Name" placeholder="Enter your username" className="my-2" />
      <CustomButton onClick={handleFocus} variant="primary" state="default" size="md" text-large>
        BUTTON
      </CustomButton>
    </div>
  )
}
