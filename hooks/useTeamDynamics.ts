'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

import { ONE_YEAR_MS } from '@/constants/company'
import { getReportingCopy } from '@/helpers/reportingCopy'
import { flattenGroups } from '@/mappers/group.mappers'
import { getTeamDynamicsVM } from '@/requests/reportingClient'
import { GroupEntity } from '@/types/company'
import { TeamDynamicsVM } from '@/types/reporting'

import { useGroups } from './useGroups'
import { useCompanyScope } from './useCompanyScope'

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoStr(days: number): string {
  const value = new Date()
  value.setDate(value.getDate() - days)
  return value.toISOString().slice(0, 10)
}

type UseTeamDynamicsResult = {
  teamId: string
  setTeamId: (value: string) => void
  teamOptions: GroupEntity[]
  teamsLoading: boolean
  teamsError: string | null
  from: string
  to: string
  setFrom: (value: string) => void
  setTo: (value: string) => void
  teamDynamics: TeamDynamicsVM | null
  loading: boolean
  error: string | null
  dateError: string | null
  refresh: () => Promise<void>
}

export function useTeamDynamics(): UseTeamDynamicsResult {
  const locale = useLocale()
  const copy = getReportingCopy(locale)
  const { session, status, isSystemAdmin, resolveCompanyId } = useCompanyScope()
  const { items: groups, loading: groupsLoading, error: groupsError } = useGroups()
  const [teamId, setTeamId] = useState('')
  const [from, setFrom] = useState(daysAgoStr(90))
  const [to, setTo] = useState(todayStr())
  const [teamDynamics, setTeamDynamics] = useState<TeamDynamicsVM | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const requestTokenRef = useRef(0)
  const teamOptions = useMemo(() => flattenGroups(groups).filter((group) => group.type === 'team'), [groups])
  const selectedTeam = useMemo(() => teamOptions.find((group) => group.id === teamId) ?? null, [teamId, teamOptions])

  useEffect(() => {
    if (teamOptions.length === 0) {
      if (teamId) {
        setTeamId('')
      }
      return
    }

    if (!selectedTeam) {
      setTeamId(teamOptions[0].id)
    }
  }, [selectedTeam, teamId, teamOptions])

  const validateDates = useCallback(() => {
    const fromDate = new Date(from)
    const toDate = new Date(to)

    if (toDate <= fromDate) {
      setDateError(copy.common.invalidDateOrder)
      return false
    }

    if (toDate.getTime() - fromDate.getTime() > ONE_YEAR_MS) {
      setDateError(copy.common.invalidDateRange)
      return false
    }

    setDateError(null)
    return true
  }, [copy.common.invalidDateOrder, copy.common.invalidDateRange, from, to])

  const refresh = useCallback(async () => {
    if (status !== 'authenticated') return
    if (!validateDates()) return

    const token = ++requestTokenRef.current
    setLoading(true)
    setError(null)

    if (!selectedTeam) {
      if (requestTokenRef.current === token) {
        setTeamDynamics(null)
        setLoading(false)
      }
      return
    }

    const companyId = await resolveCompanyId()
    if (!companyId) {
      if (requestTokenRef.current === token) {
        setTeamDynamics(null)
        setLoading(false)
      }
      return
    }

    const result = await getTeamDynamicsVM(
      session,
      companyId,
      {
        from,
        to,
        groupId: selectedTeam.id,
        groupLabel: selectedTeam.name,
      },
      locale,
      isSystemAdmin
    )
    if (requestTokenRef.current !== token) return

    if ('error' in result) {
      setError(result.error)
      setTeamDynamics(null)
      setLoading(false)
      return
    }

    setTeamDynamics(result.data)
    setLoading(false)
  }, [from, isSystemAdmin, locale, resolveCompanyId, selectedTeam, session, status, to, validateDates])

  useEffect(() => {
    if (status === 'authenticated') {
      refresh()
    } else if (status === 'unauthenticated') {
      requestTokenRef.current += 1
      setTeamDynamics(null)
      setLoading(false)
      setError(null)
      setDateError(null)
    }
  }, [refresh, status])

  return {
    teamId,
    setTeamId,
    teamOptions,
    teamsLoading: groupsLoading,
    teamsError: groupsError,
    from,
    to,
    setFrom,
    setTo,
    teamDynamics,
    loading,
    error,
    dateError,
    refresh,
  }
}
