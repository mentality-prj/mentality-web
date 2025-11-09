import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const cityName = url.searchParams.get('cityName')
  const limit = url.searchParams.get('limit') || '10'
  const page = url.searchParams.get('page') || '1'

  const apiKey = process.env.NOVA_POSHTA_API_KEY

  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 500 })
  }

  const apiUrl = `https://api.novaposhta.ua/v2.0/json/AddressGeneral/searchSettlements`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: cityName,
        Limit: limit,
        Page: page,
      },
    }),
  })

  const data = await response.json()

  return NextResponse.json(data)
}
