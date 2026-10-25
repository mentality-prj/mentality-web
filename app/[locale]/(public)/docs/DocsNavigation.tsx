import type { PublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

export function DocsNavigation({ docs, activeSlug }: { docs: PublicDocs; activeSlug?: string }) {
  return (
    <nav
      aria-label={docs.nav}
      className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] md:overflow-y-auto"
    >
      <Link href="/docs" className="mb-3 block rounded-xl px-3 py-2 font-semibold text-slate-900 hover:bg-slate-50">
        {docs.back}
      </Link>
      <ul className="space-y-1">
        {docs.articles.slice(0, 8).map((article) => (
          <li key={article.slug}>
            <Link
              href={`/docs/${article.slug}`}
              aria-current={activeSlug === article.slug ? 'page' : undefined}
              className={`block rounded-xl px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 ${
                activeSlug === article.slug
                  ? 'bg-violet-100 font-semibold text-violet-950'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-6 border-t border-slate-200 px-3 pt-4 text-xs font-bold uppercase tracking-wider text-slate-500">
        {docs.referenceTitle}
      </h2>
      <ul className="mt-2 space-y-1">
        {docs.articles.slice(8).map((article) => (
          <li key={article.slug}>
            <Link
              href={`/docs/${article.slug}`}
              aria-current={activeSlug === article.slug ? 'page' : undefined}
              className={`block rounded-xl px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 ${
                activeSlug === article.slug
                  ? 'bg-violet-100 font-semibold text-violet-950'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
