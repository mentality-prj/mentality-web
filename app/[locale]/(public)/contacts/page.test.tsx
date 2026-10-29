import type { ReactElement } from 'react'

import ContactPage from './page'

jest.mock('@/components/features/Contact/ContactForm', () => ({
  ContactForm: () => null,
}))

type FormProps = { source?: string; intent?: string; segment?: string }

async function formProps(params: Record<string, string>): Promise<FormProps> {
  const page = (await ContactPage({ searchParams: Promise.resolve(params) })) as ReactElement<{
    children: ReactElement<FormProps>
  }>
  return page.props.children.props
}

describe('Contact page attribution', () => {
  it('accepts landing demo requests for teams and research', async () => {
    expect(await formProps({ source: 'landing', intent: 'demo', segment: 'teams' })).toEqual({
      source: 'landing',
      intent: 'demo',
      segment: 'teams',
    })
    expect(await formProps({ source: 'landing', intent: 'demo', segment: 'research' })).toEqual({
      source: 'landing',
      intent: 'demo',
      segment: 'research',
    })
  })

  it('keeps funding intents restricted to docs', async () => {
    expect(await formProps({ source: 'landing', intent: 'funding', segment: 'investment' })).toEqual({
      source: undefined,
      intent: undefined,
      segment: undefined,
    })
    expect(await formProps({ source: 'docs', intent: 'funding', segment: 'grant' })).toEqual({
      source: 'docs',
      intent: 'funding',
      segment: 'grant',
    })
  })

  it('ignores unknown sources', async () => {
    expect((await formProps({ source: 'ads', intent: 'demo', segment: 'teams' })).source).toBeUndefined()
  })
})
