import { NextRequest, NextResponse } from 'next/server'

import { getAuthHeaders } from '@/actions/getAuthHeaders'
import { APIUrl } from '@/requests/config'

/**
 * K10 Test API Proxy Route
 *
 * Currently provides only a POST handler for submitting K10 tests.
 * Proxies requests to the external backend API with authentication headers.
 *
 * NOTE: Unlike PHQ-9, which has dedicated proxy routes at /api/phq9/latest and /api/phq9/history,
 * K10 is missing equivalent /api/k10/latest and /api/k10/history routes.
 * Frontend hooks (useTestPageForm, TestHistoryChart) currently call these endpoints
 * directly to the external backend. Consider adding proxy routes for consistency
 * and to enable server-side rendering (SSR) in contexts where client-only API
 * calls are not appropriate.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const headers = await getAuthHeaders()

    // Proxy POST request to backend K10 endpoint with authentication
    const res = await fetch(`${APIUrl}/k10`, {
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
