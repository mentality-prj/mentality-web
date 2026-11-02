'use client'

import { useMemo, useState } from 'react'

const copy = {
  uk: {
    title: 'Перевірте економічний сценарій на власних припущеннях',
    lead: 'Калькулятор не використовує ціни Dzvin.co або обіцяні результати. Змініть значення на власні показники та використовуйте висновок лише як гіпотезу для пілоту.',
    people: 'Кількість учасників',
    hourly: 'Вартість робочої години (PLN)',
    recovered: 'Фактично відновлені години на учасника за місяць',
    fee: 'Умовна ціна сервісу за учасника на місяць (PLN)',
    setup: 'Разові витрати впровадження (PLN)',
    value: 'Оцінка річної вартості відновленого часу',
    cost: 'Умовні річні витрати',
    net: 'Умовна різниця за рік',
    roi: 'Умовний ROI',
    breakeven: 'Поріг окупності, год/особу/міс',
    empty: 'Вкажіть припущення щодо вартості сервісу',
    caveat:
      'У розрахунку йдеться про сценарій за заданих припущень, а не про підтверджений результат Dzvin.co. Фактичний ефект, ціну, обсяг використання та метод вимірювання слід узгодити під час пілоту.',
  },
  en: {
    title: 'Model business value using your own assumptions',
    lead: 'This calculator includes no official Dzvin.co pricing or promised performance. Enter your figures and use the outcome only as a pilot hypothesis.',
    people: 'Participants',
    hourly: 'Hourly labor cost (PLN)',
    recovered: 'Hours actually recovered per person per month',
    fee: 'Assumed monthly platform fee per person (PLN)',
    setup: 'One-time setup cost (PLN)',
    value: 'Annual value of recovered time',
    cost: 'Assumed annual cost',
    net: 'Illustrative annual difference',
    roi: 'Illustrative ROI',
    breakeven: 'Break-even hours/person/month',
    empty: 'Enter assumed platform costs',
    caveat:
      'The result is a scenario calculation, not a verified Dzvin.co outcome. Actual impact, pricing, participation and measurement should be agreed during a pilot.',
  },
  pl: {
    title: 'Sprawdź scenariusz na własnych założeniach',
    lead: 'Kalkulator nie zawiera oficjalnego cennika Dzvin.co ani obietnicy efektów. Wprowadź własne dane i potraktuj wynik jako hipotezę do pilotażu.',
    people: 'Liczba uczestników',
    hourly: 'Koszt godziny pracy (PLN)',
    recovered: 'Godziny faktycznie odzyskane na osobę miesięcznie',
    fee: 'Założona opłata miesięczna na osobę (PLN)',
    setup: 'Jednorazowy koszt wdrożenia (PLN)',
    value: 'Roczna wartość odzyskanego czasu',
    cost: 'Założone koszty roczne',
    net: 'Hipotetyczna różnica roczna',
    roi: 'Hipotetyczny ROI',
    breakeven: 'Próg rentowności, godz./os./mies.',
    empty: 'Wprowadź założony koszt platformy',
    caveat:
      'Wynik jest scenariuszem, nie potwierdzonym efektem Dzvin.co. Rzeczywiste rezultaty, ceny, udział i metodę pomiaru należy uzgodnić w pilocie.',
  },
}

export function RoiScenarioCalculator({ locale }: { locale: string }) {
  const lang: 'uk' | 'en' | 'pl' = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const t = copy[lang]
  const [people, setPeople] = useState(100)
  const [hourly, setHourly] = useState(80)
  const [recovered, setRecovered] = useState(0)
  const [fee, setFee] = useState(0)
  const [setup, setSetup] = useState(0)
  const model = useMemo(() => {
    const value = people * recovered * hourly * 12
    const cost = people * fee * 12 + setup
    return {
      value,
      cost,
      net: value - cost,
      roi: cost > 0 ? ((value - cost) / cost) * 100 : null,
      breakEven: people * hourly > 0 ? cost / (people * hourly * 12) : null,
    }
  }, [people, hourly, recovered, fee, setup])
  const format = (value: number) =>
    new Intl.NumberFormat(lang === 'uk' ? 'uk-UA' : lang === 'pl' ? 'pl-PL' : 'en-US', {
      maximumFractionDigits: 1,
    }).format(value)
  const money = (value: number) => `${format(value)} PLN`
  const fields = [
    { label: t.people, value: people, set: setPeople, min: 1, max: 100000 },
    { label: t.hourly, value: hourly, set: setHourly, min: 0, max: 100000 },
    { label: t.recovered, value: recovered, set: setRecovered, min: 0, max: 500 },
    { label: t.fee, value: fee, set: setFee, min: 0, max: 100000 },
    { label: t.setup, value: setup, set: setSetup, min: 0, max: 100000000 },
  ]
  return (
    <section
      aria-labelledby="docs-roi-title"
      className="mt-10 rounded-3xl border border-violet-200 bg-violet-50/60 p-5 md:p-8"
    >
      <h2 id="docs-roi-title" className="text-2xl font-bold text-slate-950">
        {t.title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{t.lead}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
            {field.label}
            <input
              aria-label={field.label}
              type="number"
              min={field.min}
              max={field.max}
              step={field.label === t.recovered ? 0.1 : 1}
              value={field.value}
              onChange={(e) => {
                const parsed = Number(e.target.value)
                field.set(Number.isFinite(parsed) ? Math.max(field.min, Math.min(field.max, parsed)) : field.min)
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-offset-2 focus:outline-violet-700"
            />
          </label>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          { label: t.value, value: money(model.value) },
          { label: t.cost, value: money(model.cost) },
          { label: t.net, value: money(model.net) },
          { label: t.roi, value: model.roi === null ? t.empty : `${format(model.roi)}%` },
          { label: t.breakeven, value: model.breakEven === null ? '—' : format(model.breakEven) },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold leading-5 text-slate-600">{item.label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-600">{t.caveat}</p>
    </section>
  )
}
