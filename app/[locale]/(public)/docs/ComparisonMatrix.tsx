const labels = {
  uk: {
    title: 'Порівняння функціональних підходів',
    headings: ['Критерій', 'Разове опитування', 'Окремий дашборд', 'Цільова концепція Dzvin.co'],
    rows: [
      [
        'Повторювані спостереження',
        'Залежить від повторного запуску',
        'Залежить від джерела даних',
        'Особисті регулярні відмітки',
      ],
      [
        'Командні тренди',
        'Порівняння хвиль вручну або у звіті',
        'Залежить від конкретного продукту',
        'Групові тренди й фільтри',
      ],
      ['Права доступу', 'За налаштуваннями інструменту', 'За налаштуваннями інструменту', 'Ролі, групи та дозволи'],
      [
        'Події та дії менеджера',
        'Зазвичай поза анкетою',
        'Залежить від конкретного продукту',
        'Стрічка подій і workflow дій',
      ],
      ['Дослідницька робота', 'Залежить від анкети', 'Залежить від продукту', 'Проєкти, когорти, експорт і аудит'],
    ],
    note: 'Порівнюються типові функціональні підходи та запланований обсяг Dzvin.co. Фактична доступність модулів визначається реєстром готовності.',
  },
  en: {
    title: 'Functional approach comparison',
    headings: ['Criterion', 'One-off survey', 'Standalone dashboard', 'Dzvin.co target concept'],
    rows: [
      ['Repeated observations', 'Requires repeat fielding', 'Depends on source data', 'Personal ongoing check-ins'],
      ['Team trends', 'Comparing survey waves', 'Depends on the product', 'Group trends and filters'],
      ['Access controls', 'Depends on tool settings', 'Depends on tool settings', 'Roles, groups and access'],
      [
        'Risk events and actions',
        'Usually external to survey',
        'Depends on the product',
        'Event feed and action workflow',
      ],
      ['Research workflows', 'Survey-dependent', 'Product-dependent', 'Projects, cohorts, exports and audit'],
    ],
    note: 'This compares functional categories with Dzvin.co's target scope; actual release maturity is documented in the evidence register.',
  },
  pl: {
    title: 'Porównanie podejść funkcjonalnych',
    headings: ['Kryterium', 'Jednorazowa ankieta', 'Osobny dashboard', 'Docelowy Dzvin.co'],
    rows: [
      ['Powtarzane pomiary', 'Wymaga kolejnych ankiet', 'Zależy od źródła danych', 'Regularne samooceny'],
      ['Trendy zespołów', 'Porównanie fal ankiet', 'Zależy od produktu', 'Trendy grupowe i filtry'],
      ['Uprawnienia', 'Zależy od narzędzia', 'Zależy od narzędzia', 'Role, grupy i dostęp'],
      ['Zdarzenia i działania', 'Zwykle poza ankietą', 'Zależy od produktu', 'Zdarzenia i proces działania'],
      ['Obsługa badań', 'Zależy od ankiety', 'Zależy od produktu', 'Projekty, kohorty, eksport i audyt'],
    ],
    note: 'Porównanie kategorii i docelowych funkcji Dzvin.co. Aktualną gotowość opisuje rejestr dowodów.',
  },
}

export function ComparisonMatrix({ locale }: { locale: string }) {
  const lang: 'uk' | 'en' | 'pl' = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const t = labels[lang]
  return (
    <section className="mt-10" aria-labelledby="docs-compare-title">
      <h2 id="docs-compare-title" className="text-2xl font-bold text-slate-900">
        {t.title}
      </h2>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-900">
            <tr>
              {t.headings.map((x) => (
                <th key={x} scope="col" className="border-b border-slate-200 px-4 py-4 font-bold">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row) => (
              <tr key={row[0]} className="border-b border-slate-100 last:border-0">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-4 py-4 font-semibold text-slate-900">
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={i}
                      className={`px-4 py-4 leading-6 ${i === 3 ? 'bg-violet-50/60 font-medium text-violet-950' : 'text-slate-600'}`}
                    >
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{t.note}</p>
    </section>
  )
}
