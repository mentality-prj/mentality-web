import { Database } from 'lucide-react'

import { DipComingSoonCard } from '@/components/features/Dip/DipComingSoonCard'
import { DipConnectionBanner } from '@/components/features/Dip/DipConnectionBanner'
import type { DipConnectionStatus, DipFeature } from '@/types/dip'

function featureTypeColor(type: string): string {
  switch (type) {
    case 'numeric':
      return 'bg-blue-100 text-blue-700'
    case 'categorical':
      return 'bg-violet-100 text-violet-700'
    case 'boolean':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

function featureSourceColor(source: string): string {
  switch (source) {
    case 'events':
      return 'bg-emerald-100 text-emerald-700'
    case 'api':
      return 'bg-sky-100 text-sky-700'
    case 'computed':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

type Props = {
  features: DipFeature[]
  connection: DipConnectionStatus
  t: (key: string) => string
}

export function DataView({ features, connection, t }: Props) {
  return (
    <div className="space-y-8">
      <DipConnectionBanner
        connection={connection}
        notConfiguredLabel={t('notConfigured.label')}
        notConfiguredHint={t('notConfigured.hint')}
      />

      {/* Datasets — v0.8 */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-textcolor-primary">{t('data.datasets')}</h2>
            <p className="mt-0.5 text-sm text-textcolor-secondary">{t('data.datasetsSubtitle')}</p>
          </div>
        </div>
        <DipComingSoonCard
          icon={<Database size={24} />}
          title={t('data.datasetsEmpty')}
          description={t('data.datasetsEmptyHint')}
          badge="v0.8"
        />
      </section>

      {/* Features — real data */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-textcolor-primary">{t('data.features')}</h2>
            <p className="mt-0.5 text-sm text-textcolor-secondary">
              {features.length} {t('data.featuresCount')}
            </p>
          </div>
        </div>

        {features.length === 0 ? (
          <p className="text-sm text-textcolor-secondary">{t('data.featuresEmpty')}</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-background-alt">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('data.featureName')}</th>
                  <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('data.featureType')}</th>
                  <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">
                    {t('data.featureSource')}
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">
                    {t('data.featureTransformation')}
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-textcolor-secondary">{t('common.version')}</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature.id} className={index % 2 === 0 ? 'bg-background' : 'bg-background-alt/40'}>
                    <td className="px-5 py-3 font-mono text-sm font-medium text-textcolor-primary">{feature.name}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${featureTypeColor(feature.type)}`}
                      >
                        {feature.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${featureSourceColor(feature.source)}`}
                      >
                        {feature.source}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-textcolor-secondary">
                      {feature.transformation ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-textcolor-secondary">v{feature.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
