import { ArrowRight, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

import { getPublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const docs = getPublicDocs(locale)
  return {
    title: `${docs.title} | Dzvin.co`,
    description: docs.lead,
    alternates: {
      canonical: `https://docs.dzvin.co/${locale}/docs`,
      languages: Object.fromEntries(['uk', 'en', 'pl'].map((lang) => [lang, `https://docs.dzvin.co/${lang}/docs`])),
    },
  }
}

export default async function DocsIndexPage({ params }: Props) {
  const { locale } = await params
  const docs = getPublicDocs(locale)
  return (
    <div className="min-h-[70vh] bg-[radial-gradient(circle_at_top_left,rgba(221,214,254,0.6),transparent_37%),radial-gradient(circle_at_top_right,rgba(186,230,253,0.5),transparent_35%),#f8fafc]">
      <div className="container-max-width mx-auto px-4 py-10 tablet:px-6 md:px-8 md:py-16 lg:px-10">
        <header className="max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-4 py-2 text-sm font-semibold text-violet-800">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {docs.kicker}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{docs.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">{docs.lead}</p>
          <p className="mt-3 text-sm text-slate-500">{docs.status}</p>
        </header>
        <section aria-labelledby="doc-topics" className="mt-12">
          <h2 id="doc-topics" className="text-2xl font-bold text-slate-900">
            {docs.browse}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {docs.articles.map((article) => (
              <Link
                key={article.slug}
                href={`/docs/${article.slug}`}
                className="group flex min-h-48 flex-col rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700">{article.category}</span>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{article.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{article.summary}</p>
                <ArrowRight
                  className="mt-4 h-5 w-5 self-end text-violet-700 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
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
      </div>
    </div>
  )
}
