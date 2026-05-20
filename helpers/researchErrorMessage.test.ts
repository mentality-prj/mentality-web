import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'

function translate(key: string): string {
  switch (key) {
    case 'errors.companyBoundaryNotDefined':
      return 'Для дослідницького середовища не визначено межу компанії.'
    default:
      return key
  }
}

describe('getLocalizedResearchErrorMessage', () => {
  it('localizes english company boundary errors', () => {
    expect(getLocalizedResearchErrorMessage('Company boundary for research layer is not defined', translate)).toBe(
      'Для дослідницького середовища не визначено межу компанії.'
    )
  })

  it('localizes mixed-language company boundary errors', () => {
    expect(getLocalizedResearchErrorMessage('Company boundary для research layer не визначено', translate)).toBe(
      'Для дослідницького середовища не визначено межу компанії.'
    )
  })

  it('keeps unknown messages unchanged', () => {
    expect(getLocalizedResearchErrorMessage('Unexpected backend failure', translate)).toBe('Unexpected backend failure')
  })
})
