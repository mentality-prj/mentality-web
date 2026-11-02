import { fireEvent, render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { DiaryExportButton } from './DiaryExportButton'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/utils/toast', () => ({ notifyError: jest.fn() }))

describe('DiaryExportButton', () => {
  const originalCreate = URL.createObjectURL
  const originalRevoke = URL.revokeObjectURL

  beforeEach(() => {
    jest.useFakeTimers()
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => key)
    URL.createObjectURL = jest.fn(() => 'blob:local-diary')
    URL.revokeObjectURL = jest.fn()
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
    URL.createObjectURL = originalCreate
    URL.revokeObjectURL = originalRevoke
  })

  it('disables download for an empty diary', () => {
    render(<DiaryExportButton notes={[]} />)
    expect(screen.getByRole('button', { name: 'exportAction' })).toBeDisabled()
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('creates a local JSON file without making a network request', () => {
    render(
      <DiaryExportButton
        notes={[
          { id: '1', content: 'first', isActive: false },
          { id: '2', content: 'archived', isActive: true },
        ]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'exportAction' }))
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1)
    jest.runOnlyPendingTimers()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:local-diary')
  })
})
