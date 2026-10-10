import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from '@/lib/auth/server'
import { APIUrl } from '@/requests/config'

export const dynamic = 'force-dynamic'

const REQUEST_TIMEOUT_MS = 15_000
const MAX_BODY_BYTES = 1_000_000
const SEGMENT_PATTERN = /^[A-Za-z0-9._~-]+$/
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const

type HttpMethod = (typeof METHODS)[number]
type RouteContext = { params: { path: string[] } }

function respond(body: unknown, status: number): NextResponse {
  const response = NextResponse.json(body, { status })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export function getValidatedBackendPath(segments: string[], search: string): string | null {
  if (!Array.isArray(segments) || segments.length === 0 || segments.length > 32) return null
  if (segments.some((segment) => !SEGMENT_PATTERN.test(segment) || segment === '.' || segment === '..')) return null
  // Identity-provider endpoints must never be available through this data proxy.
  if (segments[0] === 'auth') return null
  return `${segments.join('/')}${search}`
}

function isAllowedMutation(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).origin === request.nextUrl.origin
  } catch {
    return false
  }
}

async function proxyBackendRequest(request: NextRequest, context: RouteContext, method: HttpMethod): Promise<NextResponse> {
  const path = getValidatedBackendPath(context.params.path, request.nextUrl.search)
  if (!path) return respond({ error: 'Invalid backend resource' }, 400)
  if (method !== 'GET' && !isAllowedMutation(request)) return respond({ error: 'Forbidden' }, 403)

  const session = await getServerSession()
  if (!session?.user || !session.OAuthToken) return respond({ error: 'Unauthorized' }, 401)

  let requestBody: ArrayBuffer | undefined
  if (method !== 'GET') {
    const len = Number(request.headers.get('content-length'))
    if (Number.isFinite(len) && len > MAX_BODY_BYTES) return respond({ error: 'Payload too large' }, 413)
    requestBody = await request.arrayBuffer()
    if (requestBody.byteLength > MAX_BODY_BYTES) return respond({ error: 'Payload too large' }, 413)
  }

  const baseUrl = APIUrl.trim().replace(/\/+$/, '')
  const upstreamUrl = `${baseUrl}/${path}`
  try {
    const headers = new Headers({ Authorization: `Bearer ${session.OAuthToken}` })
    const contentType = request.headers.get('content-type')
    if (contentType && method !== 'GET') headers.set('Content-Type', contentType)
    const upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body: requestBody,
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    // Never forward the user bearer credential through a backend redirect.
    if (upstream.status >= 300 && upstream.status < 400) return respond({ error: 'Unexpected upstream redirect' }, 502)
    const response = new NextResponse(upstream.body, { status: upstream.status })
    for (const key of ['content-type', 'x-total-count']) {
      const value = upstream.headers.get(key)
      if (value) response.headers.set(key, value)
    }
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch {
    return respond({ error: 'Backend temporarily unavailable' }, 502)
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context, 'GET')
}
export function POST(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context, 'POST')
}
export function PUT(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context, 'PUT')
}
export function PATCH(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context, 'PATCH')
}
export function DELETE(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context, 'DELETE')
}
