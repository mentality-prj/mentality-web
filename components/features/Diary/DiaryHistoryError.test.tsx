import { fireEvent, render, screen } from '@testing-library/react'

import { DiaryHistoryError } from './DiaryHistoryError'

const refresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

beforeEach(() => jest.clearAllMocks())

describe('diary history error', () => {
  it('offers a retry without falsely reporting an empty diary', () => {
    render(<DiaryHistoryError />)

    expect(screen.getByRole('alert')).toHaveTextContent('historyError')
    fireEvent.click(screen.getByRole('button', { name: 'retryHistory' }))
    expect(refresh).toHaveBeenCalledTimes(1)
  })
})
