import { FlaskConical } from 'lucide-react'

import { DipComingSoonCard } from '@/components/features/Dip/DipComingSoonCard'
import { DipConnectionBanner } from '@/components/features/Dip/DipConnectionBanner'
import type { DipConnectionStatus, DipWorkflow } from '@/types/dip'

function workflowStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700'
    case 'inactive':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

type Props = {
  workflows: DipWorkflow[]
  connection: DipConnectionStatus
  t: (key: string) => string
}

export function ResearchView({ workflows, connection, t }: Props) {
  return (
    <div className="space-y-8">
      <DipConnectionBanner
        connection={connection}
        notConfiguredLabel={t('notConfigured.label')}
        notConfiguredHint={t('notConfigured.hint')}
      />

      {/* Experiments — v0.8 */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-textcolor-primary">{t('research.experiments')}</h2>
            <p className="mt-0.5 text-sm text-textcolor-secondary">{t('research.experimentsSubtitle')}</p>
          </div>
        </div>
        <DipComingSoonCard
          icon={<FlaskConical size={24} />}
          title={t('research.experimentsEmpty')}
          description={t('research.experimentsEmptyHint')}
          badge="v0.8"
        />
      </section>

      {/* Current workflows as pipeline proxy */}
      {workflows.length > 0 && (
        <section>
          <h2 className="mb-4 text-base font-semibold text-textcolor-primary">{t('research.workflows')}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-textcolor-primary">{wf.name}</p>
                    <p className="mt-0.5 text-xs text-textcolor-secondary">v{wf.version}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${workflowStatusColor(wf.status)}`}
                  >
                    {wf.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-textcolor-secondary">{t('research.rules')}</p>
                    <p className="mt-0.5 text-sm font-medium text-textcolor-primary">{wf.rulesCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textcolor-secondary">{t('common.version')}</p>
                    <p className="mt-0.5 text-sm font-medium text-textcolor-primary">{wf.version}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
