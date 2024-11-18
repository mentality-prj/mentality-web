import { NextResponse } from 'next/server'

import { auth } from '@/auth'

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { role } = body

  if (!role) {
    return NextResponse.json({ message: 'Role is required' }, { status: 400 })
  }

  // Оновіть сесію (або базу даних, якщо необхідно)
  return NextResponse.json({
    message: 'Session updated',
    updatedSession: {
      ...session,
      user: {
        ...session.user,
        role,
      },
    },
  })
}
