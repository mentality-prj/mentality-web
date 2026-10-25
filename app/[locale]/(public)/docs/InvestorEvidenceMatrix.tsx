import { ArrowUpRight, CheckCircle2, Clock3, FlaskConical, ShieldAlert } from 'lucide-react'

const translations = {
  uk: {
    title: 'Матриця доказів: що існує, що перевіряємо',
    columns: ['Напрям', 'Підтверджений артефакт', 'Залишається перевірити'],
    subtitle:
      'Джерела — публічні GitHub-артефакти й відповідні release gates. Позначення «код існує» не означає завершену перевірку у production.',
    entries: [
      {
        name: 'B2C · щоденна підтримка',
        stage: 'Код і тести',
        proof: 'Маршрути чекінів, щоденника, практик і історії у Web.',
        missing: 'Наскрізна авторизація, реальні API, браузерний E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/482',
        label: 'Product roadmap',
      },
      {
        name: 'B2B · команди',
        stage: 'Код + release gate',
        proof: 'Маршрути компаній, менеджерська аналітика, компоненти decision support.',
        missing: 'Tenant isolation, RBAC, backend migrations та захищений E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/445',
        label: 'Release and security gates',
      },
      {
        name: 'R&D · Research Workspace',
        stage: 'UI + протоколи',
        proof: 'Дослідницькі проєкти, когорти, експорт, аудит і документація модулів.',
        missing: 'Етичні погодження, партнери, якісні дані й зовнішня валідація.',
        url: 'https://github.com/mentality-prj/mentality-web/tree/production/components/features/Research',
        label: 'Research components',
      },
      {
        name: 'QDIP × mental wellbeing',
        stage: 'Наукова гіпотеза',
        proof: 'Описано hybrid decision layer, explainability, uncertainty й evaluation.',
        missing: 'Формальна порівняльна перевага, реальні дані, відтворювана оцінка.',
        url: 'https://github.com/qdip-ai/qdip-docs/blob/main/docs/grant/04-scientific-novelty.md',
        label: 'Scientific novelty',
      },
      {
        name: 'Готовність до запуску',
        stage: 'Відкритий gate',
        proof: 'Документація опублікована; окремі компоненти проходили CI.',
        missing: 'Повна release-матриця, security approval, незалежний live E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/445',
        label: 'Launch criteria',
      },
    ],
    foot: 'Стан описано станом на 25 жовтня 2026. Підвищення статусу потребує перевірки конкретного середовища, тесту та підтвердження відповідального.',
  },
  en: {
    title: 'Evidence matrix: built versus still unproven',
    columns: ['Area', 'Existing evidence', 'Required next validation'],
    subtitle: 'Public source artifacts and release gates. Existing code does not mean production qualification.',
    entries: [
      {
        name: 'B2C · daily support',
        stage: 'Code and tests',
        proof: 'Check-in, journal, practice and history interfaces.',
        missing: 'Identity, real API integration and browser E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/482',
        label: 'Product roadmap',
      },
      {
        name: 'B2B · organizations',
        stage: 'Code + launch gate',
        proof: 'Company routes, group analytics and decision-support components.',
        missing: 'Tenant isolation, RBAC, backend migrations and secured E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/445',
        label: 'Release gates',
      },
      {
        name: 'R&D · Research Workspace',
        stage: 'UI + methodology',
        proof: 'Research projects, cohorts, exports and audit components.',
        missing: 'Ethics, research partners, relevant data and independent assessment.',
        url: 'https://github.com/mentality-prj/mentality-web/tree/production/components/features/Research',
        label: 'Research source',
      },
      {
        name: 'QDIP × mental wellbeing',
        stage: 'Research hypothesis',
        proof: 'Hybrid policy, explanations, uncertainty and evaluation plans.',
        missing: 'Comparative evidence and replicable performance in relevant data.',
        url: 'https://github.com/qdip-ai/qdip-docs/blob/main/docs/grant/04-scientific-novelty.md',
        label: 'Research hypothesis',
      },
      {
        name: 'Launch readiness',
        stage: 'Gate open',
        proof: 'Documentation deployed and selected CI-covered components.',
        missing: 'Complete security, integrated release and independent live E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/445',
        label: 'Go/no-go gates',
      },
    ],
    foot: 'Status dated October 25, 2026. Upgrading a claim requires test scope, environment and accountable sign-off.',
  },
  pl: {
    title: 'Macierz dowodów: co istnieje, co wymaga sprawdzenia',
    columns: ['Obszar', 'Obecne dowody', 'Co wymaga walidacji'],
    subtitle: 'Publiczne repozytoria i warunki wydania. Istniejący kod nie oznacza gotowości produkcyjnej.',
    entries: [
      {
        name: 'B2C · wsparcie codzienne',
        stage: 'Kod i testy',
        proof: 'Samoocena, dziennik, praktyki i historia.',
        missing: 'Logowanie, rzeczywiste API i testy przeglądarkowe E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/482',
        label: 'Roadmapa',
      },
      {
        name: 'B2B · organizacje',
        stage: 'Kod + warunek wydania',
        proof: 'Grupy, analityka i moduły wspomagania decyzji.',
        missing: 'Izolacja firm, RBAC, migracje i bezpieczne E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/445',
        label: 'Warunki wydania',
      },
      {
        name: 'R&D · Research Workspace',
        stage: 'UI + metodyka',
        proof: 'Projekty, kohorty, eksport i audyt.',
        missing: 'Etyka, partnerzy, dane i niezależna ocena.',
        url: 'https://github.com/mentality-prj/mentality-web/tree/production/components/features/Research',
        label: 'Kod badań',
      },
      {
        name: 'QDIP × mental wellbeing',
        stage: 'Hipoteza',
        proof: 'Polityki hybrydowe, wyjaśnienia, niepewność i ocena.',
        missing: 'Powtarzalne porównania i dowody na odpowiednich danych.',
        url: 'https://github.com/qdip-ai/qdip-docs/blob/main/docs/grant/04-scientific-novelty.md',
        label: 'Hipotezy naukowe',
      },
      {
        name: 'Gotowość do startu',
        stage: 'Otwarte warunki',
        proof: 'Dokumentacja i wybrane komponenty przechodzą CI.',
        missing: 'Bezpieczeństwo, integracja i niezależny E2E.',
        url: 'https://github.com/mentality-prj/mentality-web/issues/445',
        label: 'Go/no-go',
      },
    ],
    foot: 'Stan na 25 października 2026. Zmiana statusu wymaga dowodów, środowiska i zatwierdzenia.',
  },
}

export function InvestorEvidenceMatrix({ locale }: { locale: string }) {
  const lang: 'uk' | 'en' | 'pl' = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const t = translations[lang]
  return (
    <section
      aria-labelledby="evidence-matrix"
      className="mt-10 rounded-3xl border border-indigo-200 bg-white p-5 shadow-sm md:p-8"
    >
      <h2 id="evidence-matrix" className="text-2xl font-bold tracking-tight text-slate-950">
        {t.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{t.subtitle}</p>
      <div className="mt-6 grid gap-4">
        {t.entries.map((item, index) => {
          const Icon = index === 3 ? FlaskConical : index === 4 ? ShieldAlert : index === 1 ? Clock3 : CheckCircle2
          return (
            <article key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                  <Icon className="h-5 w-5 text-indigo-700" aria-hidden="true" />
                  {item.name}
                </h3>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">
                  {item.stage}
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t.columns[1]}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-800">{item.proof}</p>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-800">{t.columns[2]}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-800">{item.missing}</p>
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 hover:underline"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          )
        })}
      </div>
      <p className="mt-5 text-xs leading-6 text-slate-500">{t.foot}</p>
    </section>
  )
}
