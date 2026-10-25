import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  FlaskConical,
  Landmark,
  Layers3,
  Milestone,
  ShieldCheck,
} from 'lucide-react'
import type { Metadata } from 'next'

import { getPublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

import { DocsDirectory } from './DocsDirectory'

type Props = { params: Promise<{ locale: string }> }

const wording = {
  uk: {
    investment: 'Investor Deck',
    brief: 'Інвестиційний огляд за 3 хвилини',
    proof: 'Перевірити прогрес і докази',
    grant: 'Grant / R&D Deck',
    investorDescription: 'Інвестиційна логіка, розроблений прототип, шлях запуску та призначення фінансування.',
    grantDescription: 'Наукові гіпотези, методологія, Excellence / Impact / Implementation та ризики.',
    presentations: 'Презентації для фінансистів',
    export: 'Слайди відкриваються в браузері та друкуються в PDF.',
    core: 'Чому Dzvin.co вартий дослідження',
    science: 'DI × Mental Health',
    scienceText:
      'Гіпотеза: пояснюване, uncertainty-aware рішення з керуванням людиною — крок далі за окремий risk score.',
    built: 'Інженерний прототип',
    builtText:
      'Існують UI, backend-модулі й дослідницькі артефакти. Певні security та інтеграційні gates залишаються відкритими.',
    goal: 'Що дасть фінансування',
    goalText:
      'Кваліфікація інтеграцій, науковий протокол, контрольовані пілоти, незалежна перевірка та підготовка запуску.',
    timeline: 'Дорожня карта з контрольними точками',
    steps: ['Secure integration', 'Research protocol', 'Feasibility', 'DI validation', 'Controlled launch'],
    stepNote: 'Це план етапів, а не звіт про завершені пілоти. Строки й бюджет потребують погодження.',
    evidence: 'Прозорий поточний стан',
    source: 'Методологія та технічні джерела',
    sourceText: 'Публічні research-матеріали QDIP, roadmap Dzvin.co та міжнародні наукові публікації.',
    closing: 'Профінансувати перевірюваний наступний етап',
    footer: 'Почнемо з обговорення інвестиційного або грантового формату та реальних milestones.',
    productAppendix: 'Продуктові сценарії та матеріали для PO/CMO',
  },
  en: {
    investment: 'Investor Deck',
    brief: 'Three-minute investment brief',
    proof: 'Explore verified evidence',
    grant: 'Research & Grant Deck',
    investorDescription: 'Investment thesis, existing prototype, launch roadmap and use of funds.',
    grantDescription: 'Research hypotheses, evaluation protocol, Excellence / Impact / Implementation and risks.',
    presentations: 'Funding presentations',
    export: 'Show in browser or print to PDF.',
    core: 'Why Dzvin.co is worth investigating',
    science: 'DI × Mental Health',
    scienceText:
      'Research hypothesis: uncertainty-aware, explainable and user-governed action selection beyond an isolated risk score.',
    built: 'Software groundwork',
    builtText:
      'Interfaces, backend modules and research artifacts exist; integration and security release gates remain.',
    goal: 'Funding outcome',
    goalText:
      'Qualified integration, scientific protocol, bounded pilots, independent evidence and controlled launch preparation.',
    timeline: 'Evidence-gated development roadmap',
    steps: ['Secure integration', 'Research protocol', 'Feasibility', 'DI validation', 'Controlled launch'],
    stepNote: 'These are planned milestones, not completed trials. Timeline and costs need agreement.',
    evidence: 'Transparent development status',
    source: 'Science and engineering sources',
    sourceText: 'Public QDIP research narrative, Dzvin roadmap and primary scientific literature.',
    closing: 'Fund the next verifiable stage',
    footer: 'Discuss the right investment or grant instrument and evidence milestones.',
    productAppendix: 'Product and PO/CMO supporting materials',
  },
  pl: {
    investment: 'Prezentacja inwestorska',
    brief: 'Opis inwestycji w 3 minuty',
    proof: 'Dowody i status rozwoju',
    grant: 'Prezentacja grantowa',
    investorDescription: 'Teza inwestycyjna, prototyp, plan uruchomienia i cel finansowania.',
    grantDescription: 'Hipotezy, metodyka, Excellence / Impact / Implementation i ryzyka.',
    presentations: 'Prezentacje dla finansujących',
    export: 'Otwórz w przeglądarce lub wydrukuj PDF.',
    core: 'Dlaczego warto zbadać Dzvin.co',
    science: 'DI × Mental Health',
    scienceText: 'Hipoteza: wyjaśnialny wybór działania ze świadomością niepewności i kontrolą użytkownika.',
    built: 'Podstawa inżynierska',
    builtText:
      'Istnieją interfejsy, backend i materiały naukowe; część testów integracji i bezpieczeństwa jest otwarta.',
    goal: 'Cel finansowania',
    goalText:
      'Zakończenie integracji, protokół badań, ograniczone pilotaże, niezależne dowody i przygotowanie uruchomienia.',
    timeline: 'Plan etapowy',
    steps: ['Bezpieczna integracja', 'Protokół badań', 'Feasibility', 'Ocena DI', 'Kontrolowane uruchomienie'],
    stepNote: 'Plan, a nie wyniki ukończonych badań. Koszty i terminy wymagają zatwierdzenia.',
    evidence: 'Przejrzysty status rozwoju',
    source: 'Źródła naukowe i techniczne',
    sourceText: 'Publiczne materiały QDIP, roadmapa Dzvin i literatura naukowa.',
    closing: 'Sfinansuj kolejny sprawdzalny etap',
    footer: 'Porozmawiajmy o modelu finansowania i kolejnych etapach.',
    productAppendix: 'Materiały produktowe dla PO/CMO',
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
  const docs = getPublicDocs(lang)
  const t = wording[lang]
  const contact = (segment: 'investment' | 'grant') =>
    `https://www.dzvin.co/${lang}/contacts?source=docs&intent=funding&segment=${segment}`
  const decks = [
    {
      name: t.investment,
      audience: 'investment',
      description: t.investorDescription,
      icon: Landmark,
      badge: '01 / INVESTMENT',
    },
    {
      name: t.grant,
      audience: 'grant',
      description: t.grantDescription,
      icon: FlaskConical,
      badge: '02 / RESEARCH FUNDING',
    },
  ]
  const pillars = [
    { title: t.science, text: t.scienceText, icon: BrainCircuit },
    { title: t.built, text: t.builtText, icon: Layers3 },
    { title: t.goal, text: t.goalText, icon: ClipboardCheck },
  ]

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(196,181,253,0.28),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#fff_70%)]">
      <div className="container-max-width mx-auto px-4 py-10 tablet:px-6 md:px-8 md:py-16 lg:px-10">
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-11 text-white shadow-2xl md:px-12 md:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-40 h-[30rem] w-[30rem] rounded-full border-[65px] border-violet-400/10"
          />
          <div className="relative max-w-5xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-100">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {docs.kicker}
            </p>
            <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              {docs.fundingHeadline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-indigo-100 md:text-xl">{docs.fundingIntro}</p>
            <div className="mt-7 max-w-4xl rounded-2xl border border-violet-300/30 bg-white/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-200">{docs.stageLabel}</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{docs.stageDescription}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={contact('investment')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-950 transition hover:bg-violet-100"
              >
                {docs.fundingCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/docs/decks/investment"
                className="inline-flex items-center gap-2 rounded-full border border-violet-300/50 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                {docs.fundingSecondaryCta}
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold text-indigo-100">
              <Link href="/docs/funding-brief" className="underline underline-offset-4 hover:text-white">{t.brief}</Link>
              <Link href="/docs/evidence-register" className="underline underline-offset-4 hover:text-white">{t.proof}</Link>
            </div>
            <p className="mt-6 text-xs leading-6 text-indigo-200">{docs.fundingNote}</p>
          </div>
        </header>

        <section aria-label={t.presentations} className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-bold text-slate-950">{t.presentations}</h2>
            <p className="text-sm text-slate-500">{t.export}</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {decks.map((deck) => {
              const Icon = deck.icon
              return (
                <Link
                  key={deck.audience}
                  href={`/docs/decks/${deck.audience}`}
                  className="group relative flex min-h-56 flex-col overflow-hidden rounded-3xl border border-indigo-200 bg-white p-7 shadow-md transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl"
                >
                  <span className="text-xs font-bold tracking-widest text-indigo-600">{deck.badge}</span>
                  <Icon className="mt-5 h-9 w-9 text-indigo-800" aria-hidden="true" />
                  <h3 className="mt-4 text-2xl font-bold text-slate-950">{deck.name}</h3>
                  <p className="mt-2 max-w-md flex-1 text-sm leading-7 text-slate-600">{deck.description}</p>
                  <ArrowRight
                    className="mt-4 h-5 w-5 self-end text-indigo-700 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mt-16" aria-label={t.core}>
          <h2 className="text-3xl font-bold text-slate-950">{t.core}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {pillars.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-700">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              )
            })}
          </div>
        </section>
        <section
          className="mt-16 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-6 md:p-10"
          aria-label={t.timeline}
        >
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-950">
            <Milestone className="h-7 w-7 text-indigo-700" aria-hidden="true" />
            {t.timeline}
          </h2>
          <ol className="mt-7 grid gap-4 md:grid-cols-5">
            {t.steps.map((step, i) => (
              <li key={step} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs font-bold tracking-wider text-indigo-600">
                  {String(i + 1).padStart(2, '0')} / 05
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-slate-900">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm leading-6 text-slate-600">{t.stepNote}</p>
          <Link
            href="/docs/funding-roadmap"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-800 hover:underline"
          >
            {docs.articles[6].title}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <section className="mt-16" aria-label={docs.fundingLibrary}>
          <h2 className="text-3xl font-bold text-slate-950">{docs.fundingLibrary}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{docs.lead}</p>
          <DocsDirectory docs={docs} locale={lang} />
        </section>

        <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 md:p-8" aria-label={t.evidence}>
          <h2 className="flex items-center gap-3 text-xl font-bold text-slate-950">
            <ShieldCheck className="h-6 w-6 text-indigo-700" aria-hidden="true" />
            {t.evidence}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{t.sourceText}</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm font-semibold text-indigo-700">
            <a
              href="https://github.com/qdip-ai/qdip-docs/blob/main/docs/grant/04-scientific-novelty.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              QDIP — Scientific Novelty
            </a>
            <a
              href="https://github.com/mentality-prj/mentality-web/issues/482"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Dzvin product roadmap
            </a>
            <a
              href="https://doi.org/10.1016/S2215-0366(26)00127-6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              AI in Mental Health — research priorities
            </a>
          </div>
        </section>

        <section className="mt-14 rounded-3xl bg-slate-950 p-8 text-white md:p-12">
          <h2 className="text-3xl font-bold">{t.closing}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">{t.footer}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={contact('investment')}
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-violet-100"
            >
              {docs.fundingCta}
            </a>
            <a
              href={contact('grant')}
              className="rounded-full border border-violet-300/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              {t.grant}
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
