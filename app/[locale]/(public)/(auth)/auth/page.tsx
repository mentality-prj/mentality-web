'use client'

import { useEffect } from 'react'

import { useAuth } from '@/context/AuthProvider'

export default function AuthPage() {
  const { login } = useAuth()

  useEffect(() => {
    login()
  }, [login])

  return (
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      <p className="mt-4 text-textcolor-secondary">Redirecting to login...</p>
    </div>
  )
}
