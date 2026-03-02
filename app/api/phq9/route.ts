import { NextRequest, NextResponse } from 'next/server'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const headers = await getAuthHeaders()

    const res = await fetch(`${APIUrl}/phq9`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
