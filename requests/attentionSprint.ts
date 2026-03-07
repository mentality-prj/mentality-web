import { CustomSession } from '@/types/auth'
import { AttentionSprintResultPayload } from '@/types/attentionSprint'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

const ATTENTION_SPRINT_PATH = '/games/attention-sprint'

export async function saveAttentionSprintResult(
  session: CustomSession | null,
  payload: AttentionSprintResultPayload
): Promise<{ data?: unknown; error?: string }> {
  const res = await performAuthRequest(session, `${APIUrl}${ATTENTION_SPRINT_PATH}`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    return { error: res.error }
  }
  return { data: res.data }
}
