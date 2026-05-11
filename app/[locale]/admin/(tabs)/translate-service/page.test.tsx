import {
  type ComponentPropsWithoutRef,
  type JSXElementConstructor,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { compareTranslateService } from '@/requests/translateService'

import * as TranslateServicePageModule from './page'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/requests/translateService', () => ({ compareTranslateService: jest.fn() }))

jest.mock('@/ui/button', () => ({
  Button: ({ children, type = 'button', ...props }: PropsWithChildren<ComponentPropsWithoutRef<'button'>>) => (
    <button type={type} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/ui/textarea', () => ({
  Textarea: ({ children, ...props }: ComponentPropsWithoutRef<'textarea'>) => (
    <textarea {...props}>{children}</textarea>
  ),
}))

jest.mock('@/ui/select', () => {
  const React = jest.requireActual<typeof import('react')>('react')

  type MockSelectProps = PropsWithChildren<{
    value: string
    onValueChange?: (value: string) => void
  }>

  type MockSelectItemProps = PropsWithChildren<{
    value: string
  }>

  type SelectOption = {
    value: string
    label: ReactNode
  }

  const isElementWithChildren = (node: ReactNode): node is ReactElement<{ children?: ReactNode }> => {
    return React.isValidElement<{ children?: ReactNode }>(node)
  }

  const isMockSelectItemType = (
    type: string | JSXElementConstructor<MockSelectItemProps>
  ): type is JSXElementConstructor<MockSelectItemProps> & { displayName?: string } => {
    return typeof type !== 'string' && 'displayName' in type && type.displayName === 'MockSelectItem'
  }

  const isMockSelectItemElement = (node: ReactNode): node is ReactElement<MockSelectItemProps> => {
    return React.isValidElement<MockSelectItemProps>(node) && isMockSelectItemType(node.type)
  }

  const collectOptions = (children: ReactNode): SelectOption[] => {
    const options: SelectOption[] = []

    React.Children.forEach(children, (child) => {
      if (!isElementWithChildren(child)) {
        return
      }

      if (isMockSelectItemElement(child)) {
        options.push({ value: child.props.value, label: child.props.children })
      }

      if (child.props?.children) {
        options.push(...collectOptions(child.props.children))
      }
    })

    return options
  }

  const Select = ({ value, onValueChange, children }: MockSelectProps) => {
    const options = collectOptions(children)

    return (
      <select value={value} onChange={(event) => onValueChange?.(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  const Passthrough = ({ children }: PropsWithChildren) => <>{children}</>

  const SelectItem = ({ children }: MockSelectItemProps) => <>{children}</>
  SelectItem.displayName = 'MockSelectItem'

  return {
    Select,
    SelectContent: Passthrough,
    SelectGroup: Passthrough,
    SelectItem,
    SelectTrigger: Passthrough,
    SelectValue: () => null,
  }
})

const TranslateServicePage = TranslateServicePageModule.default

const mockSession = {
  user: {
    email: 'admin@test.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
}

function getTranslation(key: string): string {
  switch (key) {
    case 'title':
      return 'Порівняння сервісу перекладу'
    case 'description':
      return 'Порівняння двох моделей перекладу.'
    case 'sourceText':
      return 'Текст'
    case 'sourceTextPlaceholder':
      return 'Введіть текст для перекладу'
    case 'sourceLanguage':
      return 'Мова джерела'
    case 'targetLanguage':
      return 'Мова перекладу'
    case 'swapLanguages':
      return 'Поміняти мови'
    case 'modelA':
      return 'Модель A'
    case 'modelB':
      return 'Модель B'
    case 'swapModels':
      return 'Поміняти моделі'
    case 'translate':
      return 'Перекласти'
    case 'translating':
      return 'Перекладаємо'
    case 'resultsHeading':
      return 'Результати'
    case 'diffHeading':
      return 'Відмінності'
    case 'identicalTranslations':
      return 'Переклади ідентичні'
    default:
      return key
  }
}

describe('TranslateServicePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      session: mockSession,
      status: 'authenticated',
    })
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => getTranslation(key))
  })

  it('renders the page and keeps translate action disabled without text', () => {
    render(<TranslateServicePage />)

    expect(screen.getByText('Порівняння сервісу перекладу')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Перекласти' })).toBeDisabled()
  })

  it('swaps languages and models before sending the compare request', async () => {
    ;(compareTranslateService as jest.Mock).mockResolvedValue({
      data: {
        modelA: { model: 'gemini-1.5-flash', translation: 'Результат A', durationMs: 120 },
        modelB: { model: 'gpt-4o', translation: 'Результат B', durationMs: 140 },
      },
    })

    render(<TranslateServicePage />)

    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: 'pl' } })
    fireEvent.change(selects[3], { target: { value: 'gemini-1.5-flash' } })

    fireEvent.click(screen.getByRole('button', { name: 'Поміняти мови' }))
    fireEvent.click(screen.getByRole('button', { name: 'Поміняти моделі' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Hello world  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Перекласти' }))

    await waitFor(() => {
      expect(compareTranslateService).toHaveBeenCalledWith(mockSession, {
        text: 'Hello world',
        modelA: 'gemini-1.5-flash',
        modelB: 'gpt-4o',
        sourceLanguage: 'pl',
        targetLanguage: 'en',
      })
    })
  })

  it('shows the identical translation banner when both models return the same text', async () => {
    ;(compareTranslateService as jest.Mock).mockResolvedValue({
      data: {
        modelA: { model: 'gpt-4o', translation: 'Однаковий переклад', durationMs: 100 },
        modelB: { model: 'claude-3-5-sonnet', translation: 'Однаковий переклад', durationMs: 110 },
      },
    })

    render(<TranslateServicePage />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Sample text' } })
    fireEvent.click(screen.getByRole('button', { name: 'Перекласти' }))

    await waitFor(() => {
      expect(screen.getByText('Переклади ідентичні')).toBeInTheDocument()
    })
  })

  it('highlights word-level differences when translations differ', async () => {
    ;(compareTranslateService as jest.Mock).mockResolvedValue({
      data: {
        modelA: { model: 'gpt-4o', translation: 'alpha beta', durationMs: 90 },
        modelB: { model: 'claude-3-5-sonnet', translation: 'alpha gamma', durationMs: 95 },
      },
    })

    render(<TranslateServicePage />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Sample text' } })
    fireEvent.click(screen.getByRole('button', { name: 'Перекласти' }))

    await waitFor(() => {
      expect(screen.getByText('Результати')).toBeInTheDocument()
    })

    const betaNodes = screen.getAllByText('beta')
    const gammaNodes = screen.getAllByText('gamma')

    expect(betaNodes.some((node) => node.className.includes('bg-yellow-100'))).toBe(true)
    expect(gammaNodes.some((node) => node.className.includes('bg-blue-100'))).toBe(true)
  })
})
