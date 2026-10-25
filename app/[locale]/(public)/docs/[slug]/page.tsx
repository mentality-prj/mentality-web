import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPublicDoc, getPublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

import { ComparisonMatrix } from '../ComparisonMatrix'
import { DossierEvidence } from '../DossierEvidence'
import { DocsNavigation } from '../DocsNavigation'
import { FundingBudgetPlanner } from '../FundingBudgetPlanner'
import { RoiScenarioCalculator } from '../RoiScenarioCalculator'

type Props = { params: Promise<{ locale: string; slug: string }> }

// Article pages render with locale-aware header/session context. Do not
// statically prerender slug-only params: request-time headers/cookies in the
// shared public layout trigger DYNAMIC_SERVER_USAGE on production.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = getPublicDoc(locale, slug)
  if (!article) return {}
  return {
    title: `${article.title} | Dzvin.co`,
    description: article.summary,
    openGraph: { title: article.title, description: article.summary, type: 'article' },
    alternates: {
      canonical: `https://docs.dzvin.co/${locale}/docs/${slug}`,
      languages: Object.fromEntries(
        ['uk', 'en', 'pl'].map((lang) => [lang, `https://docs.dzvin.co/${lang}/docs/${slug}`])
      ),
    },
  }
}

export default async function DocArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const docs = getPublicDocs(locale)
  const article = getPublicDoc(locale, slug)
  if (!article) notFound()
  const lang = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const c = {
    uk: {
      demo: 'Замовити демонстрацію',
      funding: 'Обговорити фінансування',
      investDeck: 'Інвестиційна презентація',
      grantDeck: 'Грантова презентація',
      nextFunding: 'Обговорімо фінансування наступного етапу розробки й перевірки Dzvin.co.',
      presentations: 'Презентації продукту',
      teams: 'Для компаній',
      individuals: 'Для людей',
      research: 'Для досліджень',
      next: 'Підберемо сценарій перевірки Dzvin.co для вашої задачі.',
    },
    en: {
      demo: 'Request a demonstration',
      funding: 'Discuss funding',
      investDeck: 'Investor deck',
      grantDeck: 'Grant deck',
      nextFunding: 'Discuss funding for the next verifiable development stage.',
      presentations: 'Product presentations',
      teams: 'For organizations',
      individuals: 'For individuals',
      research: 'For research',
      next: 'Discuss a focused Dzvin.co demonstration for your workflow.',
    },
    pl: {
      demo: 'Poproś o prezentację',
      funding: 'Porozmawiajmy o finansowaniu',
      investDeck: 'Prezentacja inwestorska',
      grantDeck: 'Prezentacja grantowa',
      nextFunding: 'Porozmawiajmy o finansowaniu następnego etapu rozwoju Dzvin.co.',
      presentations: 'Prezentacje produktu',
      teams: 'Dla firm',
      individuals: 'Dla osób',
      research: 'Dla badań',
      next: 'Omówmy demonstrację Dzvin.co dopasowaną do potrzeb.',
    },
  }[lang]
  const segment = slug === 'research' ? 'research' : slug === 'personal' ? 'individuals' : 'teams'
  const demoUrl = `https://www.dzvin.co/${lang}/contacts?source=docs&intent=demo&segment=${segment}`
  const isFunding = docs.articles.slice(0, 6).some(item => item.slug === slug)
  const fundingUrl = `https://www.dzvin.co/${lang}/contacts?source=docs&intent=funding&segment=investment`
  return (
    <div className="min-h-[70vh] bg-[linear-gradient(180deg,#faf5ff_0%,#f8fafc_30%,white_100%)]">
      <div className="container-max-width mx-auto px-4 py-9 tablet:px-6 md:px-8 md:py-14 lg:px-10">
        <div className="grid items-start gap-9 md:grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)] lg:gap-12">
          <DocsNavigation docs={docs} activeSlug={slug} />
          <article className="min-w-0 max-w-4xl">
            <div className="mb-5 text-sm text-violet-800">
              <Link href="/docs" className="font-semibold hover:underline">
                {docs.back}
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              {article.category}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">{article.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-700">{article.summary}</p>
            <p className="mt-3 text-xs text-slate-500">{docs.status}</p>
            <div className="mt-10 space-y-10">
              {article.sections.map((section, i) => (
                <section key={section.title} aria-labelledby={`public-doc-heading-${i}`}>
                  <h2 id={`public-doc-heading-${i}`} className="text-2xl font-semibold text-slate-900">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            {slug === 'funding-request' && <FundingBudgetPlanner locale={lang} />}
            {slug === 'scientific-novelty' && <DossierEvidence locale={lang} variant="research" />}
            {(slug === 'development-progress' || slug === 'validation-plan' || slug === 'funding-roadmap') && <DossierEvidence locale={lang} variant="engineering" />}
            {slug === 'investment-thesis' && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/decks/investment" className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm font-bold text-indigo-950 hover:bg-indigo-100">{c.investDeck}</Link>
                <Link href="/docs/decks/grant" className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm font-bold text-indigo-950 hover:bg-indigo-100">{c.grantDeck}</Link>
              </div>
            )}
            {slug === 'economics' && <RoiScenarioCalculator locale={lang} />}
            {slug === 'comparison' && <ComparisonMatrix locale={lang} />}
            {slug === 'presentation-kit' && (
              <section className="mt-10" aria-label={c.presentations}>
                <h2 className="text-2xl font-bold text-slate-950">{c.presentations}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {(['teams', 'individuals', 'research'] as const).map((audience) => (
                    <Link
                      key={audience}
                      href={`/docs/decks/${audience}`}
                      className="rounded-2xl border border-violet-200 bg-violet-50 p-5 text-sm font-bold text-violet-900 transition hover:border-violet-500 hover:bg-violet-100"
                    >
                      {c[audience]}
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <section className="mt-12 rounded-3xl bg-slate-950 p-6 text-white md:p-8">
              <p className="text-xl font-bold leading-relaxed">{isFunding ? c.nextFunding : c.next}</p>
              <a
                href={isFunding ? fundingUrl : demoUrl}
                className="mt-5 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-violet-100"
              >
                {isFunding ? c.funding : c.demo}
              </a>
            </section>
            <nav aria-label={docs.links} className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-violet-800">
              <Link href={`https://www.dzvin.co/${locale}/services`} className="hover:underline">
                {docs.services}
              </Link>
              <Link href={`https://www.dzvin.co/${locale}/faq`} className="hover:underline">
                {docs.faq}
              </Link>
              <Link href={`https://www.dzvin.co/${locale}/privacy`} className="hover:underline">
                {docs.privacy}
              </Link>
            </nav>
          </article>
        </div>
      </div>
    </div>
  )
}
