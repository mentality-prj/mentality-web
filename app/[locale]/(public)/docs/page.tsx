import { ArrowRight, BarChart3, BookOpen, FlaskConical, HeartHandshake, Presentation, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { getPublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

import { DocsDirectory } from './DocsDirectory'

type Props = { params: Promise<{ locale: string }> }

const labels = {
  uk: {
    eyebrow: 'Командні сигнали · рішення · результат',
    headline: 'Побачте зміни в команді. Перейдіть до дії.',
    intro:
      'Dzvin.co поєднує регулярні спостереження, групову аналітику та роботу з ризиковими подіями. Для людини це власна історія самопочуття, для компанії — структурований процес реагування, для дослідника — керований простір програми.',
    demo: 'Запросити демонстрацію',
    economics: 'Оцінити економіку пілоту',
    decks: 'Презентації для різних аудиторій',
    teams: 'Для компаній',
    personal: 'Для людей',
    research: 'Для досліджень',
    teamDesc: 'Командні тенденції, події ризику, дозволи та дії менеджерів.',
    personalDesc: 'Самооцінка, історія, практики й цілі.',
    researchDesc: 'Когорти, дослідницькі проєкти, інспекція та звітність.',
    open: 'Відкрити слайди',
    format: 'Готові до показу та друку в PDF',
    image: 'Ілюстрація з публічного сайту Dzvin.co; не скриншот особистого кабінету або клієнтських даних.',
    source:
      'Конкретний сценарій перевіряється на демонстрації. Результати клієнтських пілотів не підміняються вигаданими цифрами.',
    section: 'Документація продукту',
    footer: 'Розглянемо пілот Dzvin.co для вашої організації.',
  },
  en: {
    eyebrow: 'Team signals · decisions · outcomes',
    headline: 'See what is changing. Take the next step.',
    intro:
      'Dzvin.co combines repeated observations, group-level analytics and risk-event workflows. For individuals, it provides a personal timeline; for organizations, a managed response; for researchers, a structured program workspace.',
    demo: 'Request a demonstration',
    economics: 'Model pilot economics',
    decks: 'Presentation decks by audience',
    teams: 'For organizations',
    personal: 'For individuals',
    research: 'For research',
    teamDesc: 'Team patterns, risk events, permissions and manager actions.',
    personalDesc: 'Check-ins, history, exercises and goals.',
    researchDesc: 'Cohorts, projects, inspection and reporting.',
    open: 'View presentation',
    format: 'Ready to present or print as PDF',
    image: 'Public Dzvin.co website illustration; not an authenticated product screenshot or customer data.',
    source:
      'Specific product workflows are verified during a demo. Customer pilot outcomes are not replaced with invented numbers.',
    section: 'Product documentation',
    footer: 'Explore a focused Dzvin.co pilot for your organization.',
  },
  pl: {
    eyebrow: 'Sygnały · decyzje · rezultaty',
    headline: 'Zobacz zmiany w zespole. Podejmij działanie.',
    intro:
      'Dzvin.co łączy powtarzane obserwacje, analitykę grup i proces obsługi zdarzeń ryzyka. Dla osób to osobista historia, dla organizacji — uporządkowana reakcja, dla badaczy — zarządzany proces programu.',
    demo: 'Umów prezentację',
    economics: 'Oceń ekonomię pilotażu',
    decks: 'Prezentacje dla trzech grup',
    teams: 'Dla firm',
    personal: 'Dla osób',
    research: 'Dla badań',
    teamDesc: 'Trendy zespołów, zdarzenia ryzyka, uprawnienia i działania.',
    personalDesc: 'Samooceny, historia, ćwiczenia i cele.',
    researchDesc: 'Kohorty, projekty, inspekcja i raportowanie.',
    open: 'Zobacz prezentację',
    format: 'Gotowe do prezentacji i wydruku PDF',
    image: 'Ilustracja z publicznej witryny Dzvin.co; nie zrzut ekranu aplikacji ani dane klienta.',
    source: 'Konkretne procesy należy sprawdzić na demo. Wyniki pilotażu nie są zastępowane wymyślonymi liczbami.',
    section: 'Dokumentacja produktu',
    footer: 'Omówmy pilotaż Dzvin.co w Twojej organizacji.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const docs = getPublicDocs(locale)
  return {
    title: docs.title,
    description: docs.lead,
    alternates: {
      canonical: `https://docs.dzvin.co/${locale}/docs`,
      languages: Object.fromEntries(['uk', 'en', 'pl'].map((lang) => [lang, `https://docs.dzvin.co/${lang}/docs`])),
    },
    openGraph: { title: docs.title, description: docs.lead, type: 'website' },
  }
}

export default async function DocsIndexPage({ params }: Props) {
  const { locale } = await params
  const lang = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const t = labels[lang]
  const docs = getPublicDocs(lang)
  const deckOptions = [
    { audience: 'teams', name: t.teams, description: t.teamDesc, icon: Users, tint: 'bg-indigo-100 text-indigo-900' },
    {
      audience: 'individuals',
      name: t.personal,
      description: t.personalDesc,
      icon: HeartHandshake,
      tint: 'bg-emerald-100 text-emerald-900',
    },
    {
      audience: 'research',
      name: t.research,
      description: t.researchDesc,
      icon: FlaskConical,
      tint: 'bg-violet-100 text-violet-900',
    },
  ]
  const demoUrl = `https://www.dzvin.co/${lang}/contacts?source=docs&intent=demo&segment=teams`

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(221,214,254,0.7),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_70%)]">
      <div className="container-max-width mx-auto px-4 py-10 tablet:px-6 md:px-8 md:py-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-800">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {t.eyebrow}
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-6xl">
              {t.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">{t.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={demoUrl}
                className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-800"
              >
                {t.demo}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/docs/economics"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-violet-400"
              >
                {t.economics}
              </Link>
            </div>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl">
            <Image
              src="/services/b2c.png"
              alt=""
              width={1024}
              height={559}
              className="h-auto w-full object-cover"
              sizes="(min-width:1024px) 38vw, 100vw"
            />
            <figcaption className="px-4 py-3 text-xs leading-5 text-slate-500">{t.image}</figcaption>
          </figure>
        </div>
        <section className="mt-16" aria-label={t.decks}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">{t.decks}</h2>
            <p className="text-sm text-slate-500">{t.format}</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {deckOptions.map((option) => {
              const Icon = option.icon
              return (
                <Link
                  key={option.audience}
                  href={`/docs/decks/${option.audience}`}
                  className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                >
                  <span className={`inline-flex w-fit rounded-xl p-3 ${option.tint}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{option.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{option.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
                    <Presentation className="h-4 w-4" aria-hidden="true" />
                    {t.open}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
        <section className="mt-16" aria-label={t.section}>
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-1 h-7 w-7 shrink-0 text-violet-700" aria-hidden="true" />
            <div>
              <h2 className="text-3xl font-bold text-slate-950">{t.section}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{t.source}</p>
            </div>
          </div>
          <DocsDirectory docs={docs} locale={lang} />
        </section>
        <section className="mt-16 rounded-3xl bg-slate-950 px-6 py-9 text-white md:px-10">
          <p className="text-xl font-semibold">{t.footer}</p>
          <a
            href={demoUrl}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-violet-100"
          >
            {t.demo}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </div>
    </div>
  )
}
