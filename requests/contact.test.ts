/** @jest-environment jsdom */
import { sendContactForm } from './contact'

const originalFetch = global.fetch
afterAll(() => {
  global.fetch = originalFetch
})
beforeEach(() => {
  jest.clearAllMocks()
})

it('sends the anonymous contact form through the same Next.js API without browser credentials', async () => {
  global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 201 })) as unknown as typeof fetch

  const payload = {
    name: 'Guest',
    email: 'guest@example.test',
    message: 'Hello',
    token: 'captcha-response',
  }
  const response = await sendContactForm(payload)

  expect(response.status).toBe(201)
  expect(global.fetch).toHaveBeenCalledWith('/api/backend/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
})
