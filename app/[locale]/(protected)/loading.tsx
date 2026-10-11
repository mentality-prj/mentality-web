import { getLocale } from 'next-intl/server'

const loadingLabels: Record<string, string> = {
  uk: 'Завантаження',
  en: 'Loading',
  pl: 'Ładowanie',
}

export default async function Loading() {
  const locale = await getLocale()
  return (
    <div className="flex w-full flex-col gap-4" aria-busy="true" aria-label={loadingLabels[locale] ?? loadingLabels.en}>
      <div className="h-8 w-40 animate-pulse rounded-md bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}
