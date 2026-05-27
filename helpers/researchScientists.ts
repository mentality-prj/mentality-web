import { getEmployees, getEmployeesAdmin } from '@/requests/employees'
import { CustomSession } from '@/types/auth'
import { ResearchScientistOption } from '@/types/research'

export function getResearchScientistLabel(scientist: ResearchScientistOption): string {
  return scientist.email ? `${scientist.name} (${scientist.email})` : scientist.name
}

export function getResearchScientistName(
  scientists: ResearchScientistOption[],
  userId: string,
  fallbackName?: string
): string | null {
  const scientist = scientists.find((item) => item.id === userId)

  if (scientist?.name) {
    return scientist.name
  }

  if (fallbackName && fallbackName !== userId) {
    return fallbackName
  }

  return null
}

export async function getResearchScientistOptions(
  session: CustomSession | null,
  companyId: string,
  userIds?: string[]
): Promise<ResearchScientistOption[]> {
  if (!session) {
    return []
  }

  if (!companyId) {
    return []
  }

  const pendingUserIds = userIds ? new Set(userIds.filter(Boolean)) : null
  if (pendingUserIds && pendingUserIds.size === 0) {
    return []
  }

  const scientists: ResearchScientistOption[] = []
  const limit = 100
  let page = 1
  let total = Number.POSITIVE_INFINITY

  while ((page - 1) * limit < total && (!pendingUserIds || pendingUserIds.size > 0)) {
    const employeesResult =
      session.user?.role === 'admin'
        ? await getEmployeesAdmin(session, companyId, page, limit)
        : await getEmployees(session, companyId, page, limit)

    if ('error' in employeesResult) {
      return scientists
    }

    total = employeesResult.data.total

    employeesResult.data.items.forEach((employee) => {
      if (pendingUserIds && !pendingUserIds.has(employee.id)) {
        return
      }

      scientists.push({
        id: employee.id,
        name: employee.name,
        email: employee.email,
      })
      pendingUserIds?.delete(employee.id)
    })

    if (employeesResult.data.items.length === 0) {
      break
    }

    page += 1
  }

  return scientists
}
