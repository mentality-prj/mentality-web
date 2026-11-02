'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'

import type { PublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

const labels = {
  uk: {
    search: 'Пошук за матеріалами',
    noResults: 'Нічого не знайдено',
    funding: 'Стратегія, дослідження та програма розвитку',
    product: 'Продуктова концепція та застосування',
    reference: 'Функціональні та нормативні матеріали',
  },
  en: {
    search: 'Search documentation',
    noResults: 'No matching pages',
    funding: 'Strategy, research and development programme',
    product: 'Product concept and applications',
    reference: 'Product reference and governance',
  },
  pl: {
    search: 'Przeszukaj dokumentację',
    noResults: 'Brak wyników',
    funding: 'Strategia, badania i program rozwoju',
    product: 'Koncepcja produktu i zastosowania',
    reference: 'Dokumentacja funkcjonalna i zasady',
  },
}

export function DocsDirectory({ docs, locale }: { docs: PublicDocs; locale: string }) {
  const lang: 'uk' | 'en' | 'pl' = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const t = labels[lang]
  const [search, setSearch] = useState('')
  const groups = useMemo(
    () => [
      { label: t.funding, articles: docs.articles.slice(0, 9) },
      { label: t.product, articles: docs.articles.slice(9, 17) },
      { label: t.reference, articles: docs.articles.slice(17) },
    ],
    [docs.articles, t.funding, t.product, t.reference]
  )
  const normalized = search.trim().toLocaleLowerCase(lang)
  const found = groups.map((group) => ({
    ...group,
    articles: group.articles.filter(
      (article) =>
        !normalized ||
        [article.title, article.category, article.summary, ...article.sections.map((s) => s.title)].some((v) =>
          v.toLocaleLowerCase(lang).includes(normalized)
        )
    ),
  }))
  return (
    <div className="mt-12">
      <label htmlFor="docs-search" className="mb-3 block text-sm font-semibold text-slate-800">
        {t.search}
      </label>
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
        <input
          id="docs-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
          className="w-full rounded-2xl border border-slate-300 bg-white px-12 py-3 text-base text-slate-900 outline-offset-2 focus:outline-violet-700"
        />
      </div>
      {found.every((group) => group.articles.length === 0) && (
        <p role="status" className="mt-7 text-slate-600">
          {t.noResults}
        </p>
      )}
      {found.map(
        (group) =>
          group.articles.length > 0 && (
            <section key={group.label} className="mt-10" aria-label={group.label}>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{group.label}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/docs/${article.slug}`}
                    className="group flex min-h-44 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700"
                  >
                    <span className="text-xs font-bold uppercase tracking-wide text-violet-700">
                      {article.category}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-slate-950">{article.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{article.summary}</p>
                    <ArrowUpRight className="mt-3 h-5 w-5 self-end text-violet-700" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          )
      )}
    </div>
  )
}
