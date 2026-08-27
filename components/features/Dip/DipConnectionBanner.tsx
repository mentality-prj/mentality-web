import type { DipConnectionStatus } from '@/types/dip'

type Props = {
  connection: DipConnectionStatus
  notConfiguredLabel: string
  notConfiguredHint: string
  credentialsHintLines?: string[]
}

export function DipConnectionBanner({
  connection,
  notConfiguredLabel,
  notConfiguredHint,
  credentialsHintLines,
}: Props) {
  if (connection.configured) return null

  const lines = credentialsHintLines ?? [
    'DIP_URL=http://localhost:8000',
    'DIP_ADMIN_API_KEY=dev-api-key',
    '# optional: DIP_API_KEY=<org-scoped-key>',
  ]

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <p className="text-sm font-medium text-amber-800">{notConfiguredLabel}</p>
      <p className="mt-1 text-sm text-amber-700">{notConfiguredHint}</p>
      <code className="mt-2 block rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-900">
        {lines.map((line, index) => (
          <span key={line}>
            {line}
            {index < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </code>
    </div>
  )
}
