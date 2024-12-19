'use client'

import { useEffect } from 'react'

import { useToast } from '@/utils/toast'

export default function ServerMessage({ message, type }: { message: string; type: 'success' | 'error' }) {
  const { triggerToast } = useToast()
  useEffect(() => {
    triggerToast(message, type)
  }, [])

  return <></>
}
