import { z } from 'zod'

// Decode the NestJS reporting feed at the API boundary. A malformed upstream
// response must not masquerade as an empty feed (including individual events).
const namedRiskEvent = z
  .object({
    eventId: z.string().trim().min(1).optional(),
    id: z.string().trim().min(1).optional(),
    signal: z.string().trim().min(1).optional(),
    title: z.string().trim().min(1).optional(),
  })
  .passthrough()
  .refine((event) => Boolean(event.eventId || event.id || event.signal || event.title), {
    message: 'Risk event must carry an identifier or a title',
  })

const riskEventList = z.array(namedRiskEvent)
const riskEventFeed = z.union([riskEventList, z.object({ items: riskEventList }).passthrough()])

export function decodeRiskEventFeed(value: unknown): Record<string, unknown>[] | null {
  const parsed = riskEventFeed.safeParse(value)
  if (!parsed.success) return null

  return Array.isArray(parsed.data) ? parsed.data : parsed.data.items
}
