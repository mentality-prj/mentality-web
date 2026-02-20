import { logger } from '@/lib/logger'

export function makeContainerClickHandler(onClick?: () => void) {
  return (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return
    const target = e.target as HTMLElement | null
    try {
      if (target && target.closest && target.closest('[data-card-tools]')) return
    } catch (err) {
      logger.error(
        'cardHandlers: error while checking click target',
        err instanceof Error ? err : { error: String(err) }
      )
    }
    onClick()
  }
}

export function makeContainerKeyDownHandler(onClick?: () => void) {
  return (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    try {
      if (e.target !== e.currentTarget) return
      const k = e.key
      if (k === 'Enter' || k === ' ' || k === 'Spacebar' || e.code === 'Space') {
        const target = e.target as HTMLElement | null
        if (target && target.closest && target.closest('[data-card-tools]')) return
        e.preventDefault()
        onClick()
      }
    } catch (err) {
      logger.error('cardHandlers: error in keydown handler', err instanceof Error ? err : { error: String(err) })
    }
  }
}

const cardHandlers = { makeContainerClickHandler, makeContainerKeyDownHandler }
export default cardHandlers
