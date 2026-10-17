import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from '@/lib/auth/server'
import { getValidatedBackendPath } from '@/lib/backend/path'
import { isB2CBackendResourceAllowed, isB2COnlyRelease } from '@/lib/b2cReleasePolicy'
import { APIUrl } from '@/requests/config'

export const dynamic = 'force-dynamic'

const REQUEST_TIMEOUT_MS = 15_000
const MAX_BODY_BYTES = 1_000_000
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RouteContext = { params: Promise<{ path: string[] }> }

function respond(body: unknown, status: number): NextResponse {
  const payload =
    body && typeof body === 'object' && 'error' in body && !('message' in body)
      ? { ...body, message: (body as { error: string }).error }
      : body
  const response = NextResponse.json(payload, { status })
  response.headers.set('Cache-Control', 'no-store')
  return response
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

async function proxyBackendRequest(
  request: NextRequest,
  context: RouteContext,
  method: HttpMethod
): Promise<NextResponse> {
  const { path: pathSegments } = await context.params
  const path = getValidatedBackendPath(pathSegments, request.nextUrl.search, method)
  if (!path) return respond({ error: 'Invalid backend resource' }, 400)
  if (isB2COnlyRelease() && !isB2CBackendResourceAllowed(path)) {
    return respond({ error: 'Not found' }, 404)
  }
  if (method !== 'GET' && !isAllowedMutation(request)) return respond({ error: 'Forbidden' }, 403)

  // NestJS marks POST /contact as @Public and verifies reCAPTCHA itself.
  // No authenticated session or bearer is ever forwarded on this exact route.
  const isPublicContact = method === 'POST' && path === 'contact'
  const session = isPublicContact ? null : await getServerSession()
  if (!isPublicContact && (!session?.user || !session.OAuthToken)) {
    return respond({ error: 'Unauthorized' }, 401)
  }

  let requestBody: ArrayBuffer | undefined
  if (method !== 'GET') {
    const contentLength = Number(request.headers.get('content-length'))
    if (contentLength > MAX_BODY_BYTES)
      return respond({ error: 'Payload too large', message: 'Payload too large' }, 413)

    // Never materialize an unbounded body before checking its size.
    if (request.body) {
      const reader = request.body.getReader()
      const buffer = new Uint8Array(MAX_BODY_BYTES)
      let size = 0
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          if (value.byteLength > MAX_BODY_BYTES - size) {
            await reader.cancel().catch(() => undefined)
            return respond({ error: 'Payload too large', message: 'Payload too large' }, 413)
          }
          buffer.set(value, size)
          size += value.byteLength
        }
        requestBody = buffer.buffer.slice(0, size)
      } catch {
        await reader.cancel().catch(() => undefined)
        return respond({ error: 'Invalid request body', message: 'Invalid request body' }, 400)
      } finally {
        reader.releaseLock()
      }
    }
  }

  const baseUrl = APIUrl.trim().replace(/\/+$/, '')
  const upstreamUrl = `${baseUrl}/${path}`
  try {
    const headers = new Headers()
    if (!isPublicContact && session?.OAuthToken) {
      headers.set('Authorization', `Bearer ${session.OAuthToken}`)
    }
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
