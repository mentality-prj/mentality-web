import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const cityName = url.searchParams.get('cityName')
  const limit = url.searchParams.get('limit') || '10'
  const page = url.searchParams.get('page') || '1'

  const apiKey = 'b44340a60a78e994a16e08b98f362a93' // Замість 'ВАШ_КЛЮЧ' використовуйте ваш реальний ключ
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
