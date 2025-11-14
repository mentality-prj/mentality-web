import { apiRequest } from '@/helpers/api-wrapper'
import { logger } from '@/lib/logger'
import { TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Roles } from '@/types/security'

import { APIUrl } from './config'

export async function addTip(session: CustomSession | null, prompt: string | null, lang: SupportedLanguage) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to add tip', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const { data, error } = await apiRequest<TipEntity>(session, `${APIUrl}/tips`, {
    method: 'POST',
    body: { prompt, lang },
  })

  if (error) {
    logger.error('Failed to add tip', { error, prompt, lang })
    return { error: error.message }
  }

  logger.info('Tip successfully generated', { lang })
  return { data }
}

export async function getUnpublishedTips(session: CustomSession | null) {
  if (!session?.user || session.user.role !== Roles.ADMIN) {
    logger.warn('Unauthorized attempt to get unpublished tips', {
      userId: session?.user?.email,
      role: session?.user?.role,
    })
    return { error: 'Unauthorized: Admin role required' }
  }

  const { data, error } = await apiRequest<TipEntity[]>(session, `${APIUrl}/tips/unpublished`, {
    method: 'GET',
  })

  if (error) {
    logger.error('Failed to get unpublished tips', { error })
    return { error: error.message }
  }

  logger.info('Unpublished tips retrieved', { count: Array.isArray(data) ? data.length : 0 })
  return { data }
}
