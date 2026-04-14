import { NextRequest, NextResponse } from 'next/server'

const ZITADEL_ISSUER = process.env.NEXT_PUBLIC_ZITADEL_ISSUER!
const CLIENT_ID = process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID ?? process.env.ZITADEL_CLIENT_ID!
const CLIENT_SECRET = process.env.ZITADEL_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/callback`

/** POST — Exchange authorization code for tokens (server-side to keep client_secret safe) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, codeVerifier, grantType, refreshToken } = body as {
      code?: string
      codeVerifier?: string
      grantType: 'authorization_code' | 'refresh_token'
      refreshToken?: string
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    })

    if (grantType === 'authorization_code') {
      if (!code || !codeVerifier) {
        return NextResponse.json({ error: 'Missing code or codeVerifier' }, { status: 400 })
      }
      params.set('grant_type', 'authorization_code')
      params.set('code', code)
      params.set('code_verifier', codeVerifier)
      params.set('redirect_uri', REDIRECT_URI)
    } else if (grantType === 'refresh_token') {
      if (!refreshToken) {
        return NextResponse.json({ error: 'Missing refreshToken' }, { status: 400 })
      }
      params.set('grant_type', 'refresh_token')
      params.set('refresh_token', refreshToken)
    } else {
      return NextResponse.json({ error: 'Invalid grantType' }, { status: 400 })
    }

    const tokenResponse = await fetch(`${ZITADEL_ISSUER}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    const data = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json(data, { status: tokenResponse.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
