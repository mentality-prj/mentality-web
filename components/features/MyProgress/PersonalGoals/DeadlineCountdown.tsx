'use client'
import { useEffect, useRef, useState } from 'react'
import { Timer } from 'lucide-react'
import { useTranslations } from 'next-intl'

import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import { useAuth } from '@/context/AuthProvider'
import { Link } from '@/i18n/navigation'
import { fetchPersonalGoals } from '@/requests/personalGoals'
import { GoalEntity } from '@/types/api-responses'
import { Statuses } from '@/types/goals'

const THRESHOLD_MS = 60 * 60 * 1000 // 1 hour

function getMsLeft(deadline: string): number {
  return new Date(deadline).getTime() - Date.now()
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00'
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function findUrgentGoal(goals: GoalEntity[]): GoalEntity | null {
  return (
    goals
      .filter(
        (g) =>
          (g.status === Statuses.PENDING || g.status === Statuses.IN_PROGRESS) &&
          g.deadline &&
          getMsLeft(g.deadline) > 0 &&
          getMsLeft(g.deadline) <= THRESHOLD_MS
      )
      .sort((a, b) => getMsLeft(a.deadline!) - getMsLeft(b.deadline!))
      .at(0) ?? null
  )
}

interface DeadlineCountdownProps {
  initialGoals?: GoalEntity[]
  href: string
}

export const DeadlineCountdown = ({ initialGoals, href }: DeadlineCountdownProps) => {
  const { session } = useAuth()
  const t = useTranslations('common.Buttons')
  const goalsRef = useRef<GoalEntity[]>(initialGoals ?? [])
  const [urgentGoal, setUrgentGoal] = useState<GoalEntity | null>(() =>
    initialGoals ? findUrgentGoal(initialGoals) : null
  )
  const [countdown, setCountdown] = useState<string>('')

  // Fetch goals if not pre-loaded
  useEffect(() => {
    if (initialGoals) return
    const fetch = async () => {
      const res = await fetchPersonalGoals(session)
      if ('error' in res) return
      const fetched = res.data ?? []
      goalsRef.current = fetched
      setUrgentGoal(findUrgentGoal(fetched))
    }
    void fetch()
  }, [session, initialGoals])

  // Recheck urgent goal every minute from loaded goals
  useEffect(() => {
    if (initialGoals) return
    const id = setInterval(() => setUrgentGoal(findUrgentGoal(goalsRef.current)), 60_000)
    return () => clearInterval(id)
  }, [initialGoals])

  // Countdown tick — every second
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!urgentGoal?.deadline) {
      setCountdown('')
      return
    }
    const tick = () => {
      const ms = getMsLeft(urgentGoal.deadline!)
      if (ms <= 0) {
        setUrgentGoal(findUrgentGoal(goalsRef.current))
        return
      }
      setCountdown(formatCountdown(ms))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [urgentGoal])

  if (!urgentGoal || !visible) {
    return null
  }

  return (
    <Link
      href={href}
      aria-label={`${urgentGoal.text} — ${countdown}`}
      role="timer"
      className="fixed bottom-6 right-6 z-50 flex items-center rounded-2xl bg-white px-4 py-3 shadow-lg transition-transform hover:scale-105"
    >
      <div className="flex items-center gap-xs">
        <Timer size={18} className="shrink-0 text-primary" />
        <span className="max-w-[180px] truncate text-sm font-medium">{urgentGoal.text}</span>
        <span className="font-mono text-lg font-bold tabular-nums text-primary">{countdown}</span>
      </div>
      <CloseIconButton onClick={() => setVisible(false)} aria-label={t('Close')} />
    </Link>
  )
}
