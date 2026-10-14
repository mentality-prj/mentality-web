import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'
import { isValidCompanyId } from '@/lib/auth/companyContext'
import { requestUserCompanies } from '@/lib/auth/companyBackend.server'
import { getServerSession } from '@/lib/auth/server'
import type { SupportedLanguage } from '@/types/languages'

type CompanyOption = { id: string; name: string }

const labels = {
  uk: {
    title: 'Вибір компанії',
    description: 'Виберіть компанію, у якій хочете працювати. Доступ перевіряється сервером.',
    empty: 'Для цього облікового запису немає доступних компаній.',
    error: 'Не вдалося завантажити список компаній. Повторіть спробу пізніше.',
    current: 'Активна',
  },
  en: {
    title: 'Select company',
    description: 'Choose the company you want to work in. Access is verified by the server.',
    empty: 'No companies are available for this account.',
    error: 'Unable to load companies. Please try again later.',
    current: 'Active',
  },
  pl: {
    title: 'Wybierz firmę',
    description: 'Wybierz firmę, w której chcesz pracować. Serwer weryfikuje uprawnienia.',
    empty: 'Brak dostępnych firm dla tego konta.',
    error: 'Nie udało się pobrać listy firm. Spróbuj ponownie później.',
    current: 'Aktywna',
  },
}

export default async function SelectCompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const copy = labels[locale as SupportedLanguage] ?? labels.uk
  const session = await getServerSession()

  if (!session?.user || !session.OAuthToken) redirect('/' + locale + '/auth')
  if (session.user.role === 'admin') redirect('/' + locale + Routes.ADMIN)

  const activeCompanyId = session.user.companyId
  let companies: CompanyOption[] = []
  let unavailable = false
  try {
    const response = await requestUserCompanies(session.OAuthToken)
    if (!response.ok) throw new Error('Company list unavailable')
    const payload: unknown = await response.json()
    if (!Array.isArray(payload)) throw new Error('Invalid company list')
    companies = payload.filter(
      (item): item is CompanyOption =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        isValidCompanyId(item.id) &&
        typeof item.name === 'string'
    )
  } catch {
    unavailable = true
  }

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">{copy.title}</h1>
      <p>{copy.description}</p>
      {unavailable ? <p role="alert">{copy.error}</p> : null}
      {!unavailable && companies.length === 0 ? <p>{copy.empty}</p> : null}
      {!unavailable &&
        companies.map((company) => (
          <form key={company.id} action="/api/company-context" method="post">
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              name="companyId"
              value={company.id}
              className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-background-alt"
            >
              <span className="font-semibold">{company.name}</span>
              {company.id === activeCompanyId ? <span className="text-sm">{copy.current}</span> : null}
            </button>
          </form>
        ))}
    </main>
  )
}
