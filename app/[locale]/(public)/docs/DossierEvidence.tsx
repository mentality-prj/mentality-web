import { ExternalLink } from 'lucide-react'

const sources = {
  research: [
    {
      title: 'QDIP: Scientific Novelty (public research narrative)',
      url: 'https://github.com/qdip-ai/qdip-docs/blob/main/docs/grant/04-scientific-novelty.md',
    },
    {
      title: 'Micro-randomized trials and adaptive interventions',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9755932/',
    },
    { title: 'TRIPOD+AI reporting guideline (BMJ, 2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/38626948/' },
    {
      title: 'AI in mental health: multidisciplinary research priorities (2026)',
      url: 'https://doi.org/10.1016/S2215-0366(26)00127-6',
    },
    {
      title: 'Decision-grade precision psychiatry: prediction versus action (2026)',
      url: 'https://doi.org/10.1038/s44277-026-00068-x',
    },
  ],
  engineering: [
    {
      title: 'Dzvin: canonical product roadmap (GitHub #482)',
      url: 'https://github.com/mentality-prj/mentality-web/issues/482',
    },
    {
      title: 'Dzvin: production readiness and release gates (#445)',
      url: 'https://github.com/mentality-prj/mentality-web/issues/445',
    },
    { title: 'Dzvin Web: published code and tests', url: 'https://github.com/mentality-prj/mentality-web' },
    {
      title: 'QDIP: public scientific hypothesis documentation',
      url: 'https://github.com/qdip-ai/qdip-docs/blob/main/docs/grant/04-scientific-novelty.md',
    },
  ],
}

const titles = {
  uk: {
    title: 'Першоджерела та перевірка тверджень',
    note: 'Ці джерела підтверджують науковий контекст і наявність інженерних артефактів, але не доводять ефективності Dzvin.co в реальних умовах.',
  },
  en: {
    title: 'Evidence and source documents',
    note: 'These sources establish scientific context and engineering work, not real-world effectiveness of Dzvin.co.',
  },
  pl: {
    title: 'Źródła i weryfikacja',
    note: 'Źródła potwierdzają kontekst naukowy i postęp inżynierski, ale nie dowodzą skuteczności Dzvin.co w praktyce.',
  },
}

export function DossierEvidence({ locale, variant }: { locale: string; variant: 'research' | 'engineering' }) {
  const lang: 'uk' | 'en' | 'pl' = locale === 'en' || locale === 'pl' ? locale : 'uk'
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6" aria-label={titles[lang].title}>
      <h2 className="text-xl font-bold text-slate-950">{titles[lang].title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{titles[lang].note}</p>
      <ul className="mt-5 space-y-3">
        {sources[variant].map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm font-semibold leading-6 text-indigo-700 hover:underline"
            >
              <ExternalLink className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
