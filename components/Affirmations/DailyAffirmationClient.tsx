import { auth } from '@/auth'
import { getAffirmations } from '@/requests/affirmations'

import { DailyAffirmationRandomClient } from './DailyAffirmationRandomClient'

export const DailyAffirmationClient = async () => {
  const session = await auth()

  const res = await getAffirmations(session, 1, 50)
  if ('error' in res) return null

  const items = res.data?.items ?? []
  if (items.length === 0) return null

  return <DailyAffirmationRandomClient affirmations={items} />
}
