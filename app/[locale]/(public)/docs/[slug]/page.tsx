import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPublicDoc, getPublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

import { DocsNavigation } from '../DocsNavigation'

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
