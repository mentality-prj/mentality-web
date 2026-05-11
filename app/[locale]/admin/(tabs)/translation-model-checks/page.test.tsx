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
import {
  checkTranslationModelChecksHello,
  runCompareTranslationModelCheck,
  runHelsinkiTranslationModelCheck,
} from '@/helpers/translationModelChecksApi'

import * as TranslationModelChecksPageModule from './page'

jest.mock('next-intl', () => ({ useTranslations: jest.fn() }))
jest.mock('@/context/AuthProvider', () => ({ useAuth: jest.fn() }))
jest.mock('@/helpers/translationModelChecksApi', () => ({
  checkTranslationModelChecksHello: jest.fn(),
  runCompareTranslationModelCheck: jest.fn(),
  runFacebookTranslationModelCheck: jest.fn(),
  runHelsinkiTranslationModelCheck: jest.fn(),
}))

jest.mock('@/components/shared/Cards/Card', () => ({
  __esModule: true,
  default: ({ children, text }: { children?: ReactNode; text?: ReactNode }) => (
    <div>
      {text}
      {children}
    </div>
  ),
}))

jest.mock('@/ui/button', () => ({
  Button: ({
    children,
    variant = 'default',
    type = 'button',
    ...props
  }: PropsWithChildren<ComponentPropsWithoutRef<'button'> & { variant?: string }>) => (
    <button data-variant={variant} type={type} {...props}>
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

const TranslationModelChecksPage = TranslationModelChecksPageModule.default

function getTranslation(key: string): string {
  switch (key) {
    case 'title':
      return 'Перевірка моделей перекладу'
    case 'description':
      return 'Тестування сервісу перекладу для адмінки.'
    case 'serviceStatus':
      return 'Статус сервісу'
    case 'serviceStatusDescription':
      return 'Перевірка hello endpoint.'
    case 'checkHost':
      return 'Перевірити сервіс'
    case 'checkingHost':
      return 'Перевіряємо сервіс'
    case 'helloSuccess':
      return 'Hello endpoint відповів успішно.'
    case 'unexpectedError':
      return 'Сталася неочікувана помилка.'
    case 'translationTest':
      return 'Перевірка перекладу'
    case 'translationTestDescription':
      return 'Запуск моделей перекладу.'
    case 'text':
      return 'Текст'
    case 'characters':
      return 'Символів'
    case 'textPlaceholder':
      return 'Введіть текст для перекладу'
    case 'sourceLanguage':
      return 'Мова джерела'
    case 'targetLanguage':
      return 'Мова перекладу'
    case 'swapLanguages':
      return 'Поміняти місцями'
    case 'facebookPairWarning':
      return 'Для Facebook доступна тільки пара uk-pl або pl-uk.'
    case 'runHelsinki':
      return 'Запустити Helsinki'
    case 'runningHelsinki':
      return 'Запускаємо Helsinki'
    case 'runFacebook':
      return 'Запустити Facebook'
    case 'runningFacebook':
      return 'Запускаємо Facebook'
    case 'compare':
      return 'Порівняти'
    case 'runningCompare':
      return 'Порівнюємо'
    case 'results':
      return 'Результати'
    case 'noResults':
      return 'Немає результатів'
    case 'translation':
      return 'Переклад'
    case 'emptyTranslation':
      return 'Переклад відсутній'
    default:
      return key
  }
}

const mockSession = {
  user: {
    email: 'admin@test.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
}

describe('TranslationModelChecksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      session: mockSession,
      status: 'authenticated',
    })
    ;(useTranslations as jest.Mock).mockReturnValue((key: string) => getTranslation(key))
  })

  it('renders empty state and keeps run actions disabled without text', () => {
    render(<TranslationModelChecksPage />)

    expect(screen.getByText('Немає результатів')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустити Helsinki' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Запустити Facebook' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Порівняти' })).toBeDisabled()
  })

  it('checks service availability and shows success banner', async () => {
    ;(checkTranslationModelChecksHello as jest.Mock).mockResolvedValue({
      host: 'http://localhost:3200/api',
      endpoint: '/translation-model-checks/hello',
      data: { status: 'ok' },
    })

    render(<TranslationModelChecksPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Перевірити сервіс' }))

    await waitFor(() => {
      expect(checkTranslationModelChecksHello).toHaveBeenCalledWith(mockSession)
    })

    expect(screen.getByText('Hello endpoint відповів успішно.')).toBeInTheDocument()
  })

  it('runs Helsinki check with trimmed payload and keeps the clicked button active', async () => {
    ;(runHelsinkiTranslationModelCheck as jest.Mock).mockResolvedValue({
      model: 'helsinki',
      sourceLang: 'uk',
      targetLang: 'pl',
      translation: 'Witaj swiecie',
      endpoint: '/v1/translate',
    })

    render(<TranslationModelChecksPage />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Привіт світе  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Запустити Helsinki' }))

    await waitFor(() => {
      expect(runHelsinkiTranslationModelCheck).toHaveBeenCalledWith(mockSession, {
        text: 'Привіт світе',
        sourceLang: 'uk',
        targetLang: 'pl',
      })
    })

    expect(screen.getByText('Witaj swiecie')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустити Helsinki' })).toHaveAttribute('data-variant', 'default')
    expect(screen.getByRole('button', { name: 'Запустити Facebook' })).toHaveAttribute('data-variant', 'secondary')
  })

  it('runs compare check, renders both results and marks compare as active', async () => {
    ;(runCompareTranslationModelCheck as jest.Mock).mockResolvedValue({
      endpoint: '/compare',
      helsinki: {
        model: 'helsinki',
        sourceLang: 'uk',
        targetLang: 'pl',
        translation: 'Helsinki wynik',
        endpoint: '/v1/translate',
      },
      facebook: {
        model: 'facebook',
        sourceLang: 'uk',
        targetLang: 'pl',
        translation: 'Facebook wynik',
        endpoint: '/v1/translate',
      },
    })

    render(<TranslationModelChecksPage />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Порівняй це' } })
    fireEvent.click(screen.getByRole('button', { name: 'Порівняти' }))

    await waitFor(() => {
      expect(runCompareTranslationModelCheck).toHaveBeenCalledWith(mockSession, {
        text: 'Порівняй це',
        sourceLang: 'uk',
        targetLang: 'pl',
      })
    })

    expect(screen.getByText('Helsinki wynik')).toBeInTheDocument()
    expect(screen.getByText('Facebook wynik')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Порівняти' })).toHaveAttribute('data-variant', 'default')
    expect(screen.getByRole('button', { name: 'Запустити Helsinki' })).toHaveAttribute('data-variant', 'secondary')
  })

  it('shows Facebook pair warning and disables Facebook-only actions for unsupported languages', () => {
    render(<TranslationModelChecksPage />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test input' } })

    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: 'en' } })

    expect(screen.getByText('Для Facebook доступна тільки пара uk-pl або pl-uk.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустити Helsinki' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Запустити Facebook' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Порівняти' })).toBeDisabled()
  })
})
