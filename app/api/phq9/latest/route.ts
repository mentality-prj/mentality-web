import { NextResponse } from 'next/server'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'

export async function GET() {
  try {
    const headers = await getAuthHeaders()

    const res = await fetch(`${APIUrl}/phq9/latest`, { headers })

    if (res.status === 404) {
      return NextResponse.json(null, { status: 200 })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
