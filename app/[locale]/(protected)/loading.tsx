import { getLocale } from 'next-intl/server'

const loadingLabels: Record<string, { title: string; detail: string }> = {
  uk: { title: 'Завантаження сторінки', detail: 'Підготовка твого простору…' },
  en: { title: 'Loading your page', detail: 'Preparing your space…' },
  pl: { title: 'Wczytywanie strony', detail: 'Przygotowujemy Twoją przestrzeń…' },
}

export default async function Loading() {
  const locale = await getLocale()
  const copy = loadingLabels[locale] ?? loadingLabels.en

  return (
    <div
      data-protected-route-loading
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex min-h-[min(56svh,30rem)] w-full items-center justify-center px-4 py-12"
    >
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary" aria-hidden="true">
          <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary motion-reduce:animate-none" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-textcolor-primary">{copy.title}</p>
          <p className="text-xs leading-5 text-textcolor-secondary">{copy.detail}</p>
        </div>
      </div>
    </div>
  )
}
