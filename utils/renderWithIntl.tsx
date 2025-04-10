import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

import messages from '@/messages/uk.json'

export function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="uk" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  )
}
