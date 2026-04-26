'use client'

import { useLocale, useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { DecisionSupportCompanyImpact, DecisionSupportGroupImpact } from '@/types/decisionSupport'

import { formatEur } from './helpers'

type Props = {
  companyImpact: DecisionSupportCompanyImpact | null | undefined
  groupImpacts: DecisionSupportGroupImpact[]
}

export function FinancialSection({ companyImpact, groupImpacts }: Props) {
  const t = useTranslations('pages.Company.manager.decisionSupport')
  const locale = useLocale()

  return (
    <SectionCard title={t('financial.title')}>
      <dl className="mb-4 flex flex-col gap-1 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium">{t('financial.totalEstimatedRiskEur')}:</dt>
          <dd>{formatEur(companyImpact?.totalEstimatedRiskEur ?? null, t, locale)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">{t('financial.estimatedAttritionCostEur')}:</dt>
          <dd>{formatEur(companyImpact?.estimatedAttritionCostEur ?? null, t, locale)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">{t('financial.estimatedProductivityLossEur')}:</dt>
          <dd>{formatEur(companyImpact?.estimatedProductivityLossEur ?? null, t, locale)}</dd>
        </div>
      </dl>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-textcolor-secondary">
            <tr>
              <th className="px-3 py-2">{t('financial.group')}</th>
              <th className="px-3 py-2">{t('financial.totalEstimatedRiskEur')}</th>
              <th className="px-3 py-2">{t('financial.estimatedAttritionCostEur')}</th>
              <th className="px-3 py-2">{t('financial.estimatedProductivityLossEur')}</th>
            </tr>
          </thead>
          <tbody>
            {groupImpacts.map((impact) => (
              <tr key={impact.groupId} className="border-t border-border">
                <td className="px-3 py-2">{impact.groupName}</td>
                <td className="px-3 py-2">{formatEur(impact.totalEstimatedRiskEur, t, locale)}</td>
                <td className="px-3 py-2">{formatEur(impact.estimatedAttritionCostEur, t, locale)}</td>
                <td className="px-3 py-2">{formatEur(impact.estimatedProductivityLossEur, t, locale)}</td>
              </tr>
            ))}
            {groupImpacts.length === 0 && (
              <tr>
                <td className="px-3 py-2 text-textcolor-secondary" colSpan={4}>
                  {t('financial.noTeamBreakdown')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}
