import { BrainCircuit } from 'lucide-react'

import { DipComingSoonCard } from '@/components/features/Dip/DipComingSoonCard'
import { DipConnectionBanner } from '@/components/features/Dip/DipConnectionBanner'
import type { DipConnectionStatus } from '@/types/dip'

type Props = {
  connection: DipConnectionStatus
  t: (key: string) => string
}

// Placeholder model cards shown as preview of v0.8 shape
const PLACEHOLDER_MODELS = [
  { name: 'Risk prediction', algorithm: 'Random Forest', metric: 'F1', value: '—', status: 'validated' },
  { name: 'Mood forecast', algorithm: 'XGBoost', metric: 'MAE', value: '—', status: 'experimental' },
  { name: 'Baseline', algorithm: 'Logistic Regression', metric: 'F1', value: '—', status: 'baseline' },
]

function statusColor(status: string): string {
  switch (status) {
    case 'validated':
      return 'bg-emerald-100 text-emerald-700'
    case 'experimental':
      return 'bg-amber-100 text-amber-700'
    case 'baseline':
      return 'bg-slate-100 text-slate-500'
    default:
      return 'bg-slate-100 text-slate-500'
  }
}

export function ModelsView({ connection, t }: Props) {
  return (
    <div className="space-y-8">
      <DipConnectionBanner
        connection={connection}
        notConfiguredLabel={t('notConfigured.label')}
        notConfiguredHint={t('notConfigured.hint')}
      />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-textcolor-primary">{t('models.title')}</h2>
            <p className="mt-0.5 text-sm text-textcolor-secondary">{t('models.subtitle')}</p>
          </div>
        </div>

        <DipComingSoonCard
          icon={<BrainCircuit size={24} />}
          title={t('models.registryEmpty')}
          description={t('models.registryEmptyHint')}
          badge="v0.8"
        />
      </section>

      {/* Preview of future model cards */}
      <section>
        <h2 className="mb-4 text-sm font-medium text-textcolor-secondary">{t('models.preview')}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PLACEHOLDER_MODELS.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-dashed border-border bg-background-alt/50 p-5 opacity-50"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-textcolor-primary">{model.name}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-textcolor-secondary">{model.algorithm}</p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs text-textcolor-secondary">{model.metric}</p>
                <p className="mt-0.5 text-xl font-bold text-textcolor-primary">{model.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
