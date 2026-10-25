import type { PublicDocs } from '@/content/public-docs'
import { Link } from '@/i18n/navigation'

export function DocsNavigation({ docs, activeSlug }: { docs: PublicDocs; activeSlug?: string }) {
  const groups = [
    { label: docs.fundingLibrary, articles: docs.articles.slice(0, 6) },
    { label: docs.productLibrary, articles: docs.articles.slice(6, 14) },
    { label: docs.referenceTitle, articles: docs.articles.slice(14) },
  ]
  return (
    <nav aria-label={docs.nav} className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] md:overflow-y-auto">
      <Link href="/docs" className="mb-3 block rounded-xl px-3 py-2 font-semibold text-slate-900 hover:bg-slate-50">{docs.back}</Link>
      {groups.map(group => (
        <div key={group.label} className="mt-5 border-t border-slate-200 pt-4">
          <h2 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">{group.label}</h2>
          <ul className="mt-2 space-y-1">
            {group.articles.map(article => (
              <li key={article.slug}>
                <Link
                  href={`/docs/${article.slug}`}
                  aria-current={activeSlug === article.slug ? 'page' : undefined}
                  className={`block rounded-xl px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 ${activeSlug === article.slug ? 'bg-violet-100 font-semibold text-violet-950' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
