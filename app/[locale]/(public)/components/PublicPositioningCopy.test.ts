import enTitle from '@/messages/en/common/title.json'
import enAbout from '@/messages/en/pages/About.json'
import enFaq from '@/messages/en/pages/FAQ.json'
import enLanding from '@/messages/en/pages/Landing.json'
import enServices from '@/messages/en/pages/Services.json'
import plTitle from '@/messages/pl/common/title.json'
import plAbout from '@/messages/pl/pages/About.json'
import plFaq from '@/messages/pl/pages/FAQ.json'
import plLanding from '@/messages/pl/pages/Landing.json'
import plServices from '@/messages/pl/pages/Services.json'
import ukTitle from '@/messages/uk/common/title.json'
import ukAbout from '@/messages/uk/pages/About.json'
import ukFaq from '@/messages/uk/pages/FAQ.json'
import ukLanding from '@/messages/uk/pages/Landing.json'
import ukServices from '@/messages/uk/pages/Services.json'

/**
 * Public positioning guard: Dzvin is a people-first self-support service in beta.
 * Public pages must not advertise unreleased predictive, clinical-risk or
 * employee-monitoring capabilities, nor expose internal implementation names.
 */
const forbidden = [
  '725+',
  'burnout index',
  'AI-generated executive summary',
  'DecisionSupportService',
  'DecisionReport',
  'PredictionSnapshot',
  'CohortMetric',
  'SalaryGrades',
  'AccessScopes',
  'TranslationsService',
  'ML trust score',
  'auto-mitigation',
  'Аналітика психічного стану',
  'Mental State Analytics',
  'раннього виявлення ризиків',
  'early risk detection',
  'схожими сценаріями',
  'similar scenarios',
  'Що бачить і контролює менеджер',
  'What a manager sees and controls',
]

describe('public Dzvin positioning copy', () => {
  it.each([
    { locale: 'uk', catalogs: [ukTitle, ukAbout, ukFaq, ukLanding, ukServices] },
    { locale: 'en', catalogs: [enTitle, enAbout, enFaq, enLanding, enServices] },
    { locale: 'pl', catalogs: [plTitle, plAbout, plFaq, plLanding, plServices] },
  ])('$locale public pages avoid unreleased or monitoring-style claims', ({ catalogs }) => {
    const text = JSON.stringify(catalogs)
    for (const phrase of forbidden) expect(text).not.toContain(phrase)
  })

  it.each([
    { locale: 'uk', faq: ukFaq },
    { locale: 'en', faq: enFaq },
    { locale: 'pl', faq: plFaq },
  ])('$locale FAQ keeps the three audiences and a crisis answer', ({ faq }) => {
    expect(faq.sections.map((section) => section.id)).toEqual(['b2c', 'b2b', 'rd'])
    expect(JSON.stringify(faq.sections[0])).toContain('112')
  })

  it('keeps the same About structure across locales', () => {
    const keys = (value: unknown, prefix = ''): string[] =>
      value && typeof value === 'object'
        ? Object.entries(value).flatMap(([key, child]) => keys(child, `${prefix}${key}.`))
        : [prefix]
    expect(keys(enAbout)).toEqual(keys(ukAbout))
    expect(keys(plAbout)).toEqual(keys(ukAbout))
  })
})
