'use client'

import { useTranslations } from 'next-intl'

import { GroupSelector } from '@/components/features/Company/GroupSelector'
import { useAssignManager } from '@/hooks/useAssignManager'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

export function AssignManagerForm() {
  const t = useTranslations('pages.Company.companyAdmin.assignManager')
  const {
    groups,
    managers,
    scopes,
    selectedUserId,
    setSelectedUserId,
    selectedGroupIds,
    setSelectedGroupIds,
    canViewAnalytics,
    setCanViewAnalytics,
    loading,
    isReady,
    userError,
    groupError,
    handleAssign,
    handleRevoke,
  } = useAssignManager()

  function getScopeGroupLabel(groupId: string): string {
    return groups.find((group) => group.id === groupId)?.name || groupId
  }

  return (
    <div className="flex flex-col gap-sm">
      <form onSubmit={handleAssign} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="assign-user">{t('managerLabel')}</Label>
          <Select
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            disabled={!isReady || loading || managers.length === 0}
          >
            <SelectTrigger id="assign-user">
              <SelectValue placeholder={managers.length === 0 ? t('managerEmpty') : t('managerPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name || m.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {userError && <p className="text-destructive text-xs">{userError}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t('groupsLabel')}</Label>
          <GroupSelector groups={groups} selected={selectedGroupIds} onChange={setSelectedGroupIds} />
          {groupError && <p className="text-destructive text-xs">{groupError}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-xs">
          <Checkbox
            checked={canViewAnalytics}
            onCheckedChange={(v) => setCanViewAnalytics(v === true)}
            disabled={!isReady || loading}
          />
          <span className="text-sm font-normal">{t('analyticsToggle')}</span>
        </label>

        <Button type="submit" disabled={!isReady || loading || !canViewAnalytics}>
          {loading ? t('submitting') : t('submitButton')}
        </Button>
      </form>

      {scopes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">{t('currentScopes')}</h4>
          <ul className="flex flex-col gap-1">
            {scopes.map((scope) => {
              const manager = managers.find((m) => m.id === scope.userId)
              return (
                <li
                  key={`${scope.id}:${scope.groupId}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span>{manager?.name || manager?.email || scope.userId}</span>
                  <span className="text-xs text-textcolor-secondary">{getScopeGroupLabel(scope.groupId)}</span>
                  <Button
                    size="small"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-7"
                    onClick={() => handleRevoke(scope.id)}
                  >
                    {t('revokeButton')}
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
