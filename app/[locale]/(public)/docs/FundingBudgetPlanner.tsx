'use client'

import { useMemo, useState } from 'react'

const translations = {
  uk: { title: 'Конструктор бюджету фінансування', description: 'Порожні значення за замовчуванням — сума залучення ще не погоджена. Введіть підтверджені кошторисом суми для підготовки заявки; це не офіційний funding ask.', total: 'Разом, без резерву', reserve: 'Резерв / contingency, %', final: 'Орієнтир бюджету за введеними даними', note: 'Кошторис потребує підтвердження командою, прив’язки до етапів, строків і правил відповідної грантової чи інвестиційної програми.', currency: 'Валюта розрахунку', fields: ['Розробка та інтеграції', 'Decision Intelligence R&D', 'Безпека, приватність і комплаєнс', 'Протокол, UX і пілотні дослідження', 'Хмара та інфраструктура', 'Операційне управління'] },
  en: { title: 'Funding budget builder', description: 'All inputs start empty because no funding amount has been approved. Enter costed project estimates for a proposal; this is not an official funding ask.', total: 'Base subtotal', reserve: 'Contingency, %', final: 'Budget based on entered estimates', note: 'The figures require verified quotes, staffing, milestone mapping and compliance with the chosen funding program.', currency: 'Budget currency', fields: ['Engineering and integrations', 'Decision Intelligence R&D', 'Security, privacy and compliance', 'Research protocol, UX and pilots', 'Cloud and infrastructure', 'Project operations'] },
  pl: { title: 'Kalkulator budżetu finansowania', description: 'Pola startują od zera, ponieważ nie zatwierdzono kwoty. Wprowadź realne szacunki kosztów; to nie jest oficjalna oferta.', total: 'Suma bez rezerwy', reserve: 'Rezerwa, %', final: 'Budżet według podanych kosztów', note: 'Kwoty wymagają weryfikacji, przypisania do etapów oraz zgodności z wybranym konkursem.', currency: 'Waluta', fields: ['Rozwój i integracje', 'Decision Intelligence R&D', 'Bezpieczeństwo, prywatność, zgodność', 'Protokół badawczy, UX i pilotaże', 'Chmura i infrastruktura', 'Zarządzanie projektem'] },
}
export function FundingBudgetPlanner({ locale }: { locale: string }) {
  const lang: 'uk' | 'en' | 'pl' = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const t = translations[lang]
  const [costs, setCosts] = useState([0, 0, 0, 0, 0, 0])
  const [contingency, setContingency] = useState(0)
  const [currency, setCurrency] = useState<'EUR' | 'PLN'>('EUR')
  const sum = useMemo(() => costs.reduce((a, b) => a + b, 0), [costs])
  const total = sum * (1 + contingency / 100)
  const fmt = (value: number) => new Intl.NumberFormat(lang === 'pl' ? 'pl-PL' : lang === 'uk' ? 'uk-UA' : 'en-US', { maximumFractionDigits: 0 }).format(value)
  return (
    <section aria-labelledby="funding-budget-heading" className="mt-10 rounded-3xl border border-indigo-200 bg-indigo-50/60 p-5 md:p-8">
      <h2 id="funding-budget-heading" className="text-2xl font-bold text-slate-950">{t.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t.description}</p>
      <label className="mt-6 flex max-w-xs flex-col gap-2 text-sm font-semibold text-slate-900">
        {t.currency}
        <select value={currency} onChange={e => setCurrency(e.target.value === 'PLN' ? 'PLN' : 'EUR')} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base">
          <option value="EUR">EUR</option><option value="PLN">PLN</option>
        </select>
      </label>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {t.fields.map((field, i) => (
          <label key={field} className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
            {field} ({currency})
            <input type="number" inputMode="numeric" min={0} max={1000000000} step={100} value={costs[i]}
              onChange={e => {
                const val = Number(e.target.value)
                setCosts(old => old.map((item, j) => j === i ? (Number.isFinite(val) ? Math.max(0, Math.min(1000000000, val)) : 0) : item))
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 focus:outline-violet-700"
            />
          </label>
        ))}
      </div>
      <label className="mt-5 flex max-w-xs flex-col gap-2 text-sm font-semibold text-slate-900">
        {t.reserve}
        <input type="number" min={0} max={100} value={contingency} onChange={e => {
          const val = Number(e.target.value)
          setContingency(Number.isFinite(val) ? Math.min(100, Math.max(0, val)) : 0)
        }} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base" />
      </label>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5"><p className="text-sm text-slate-600">{t.total}</p><p className="mt-2 text-3xl font-bold tabular-nums text-slate-950">{fmt(sum)} {currency}</p></div>
        <div className="rounded-2xl bg-indigo-950 p-5 text-white"><p className="text-sm text-indigo-200">{t.final}</p><p className="mt-2 text-3xl font-bold tabular-nums">{fmt(total)} {currency}</p></div>
      </div>
      <p className="mt-5 text-xs leading-6 text-slate-600">{t.note}</p>
    </section>
  )
}
