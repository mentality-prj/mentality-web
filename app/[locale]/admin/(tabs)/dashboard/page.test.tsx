import { render, screen, within } from '@testing-library/react'

import AdminDashboardPage from '@/app/[locale]/admin/(tabs)/dashboard/page'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    switch (key) {
      case 'companySection':
        return 'Компанії'
      case 'researchSection':
        return 'Дослідження'
      case 'toolsSection':
        return 'Інструменти'
      case 'companies.title':
        return 'Компанії'
      case 'companies.description':
        return 'Створення та управління компаніями на платформі'
      case 'companyAdmin.title':
        return 'Суперюзер'
      case 'companyAdmin.description':
        return 'Управління групами, співробітниками та запрошеннями'
      case 'companyManager.title':
        return 'Менеджер'
      case 'companyManager.description':
        return 'Аналітика та управління командою'
      case 'researchWorkspace.title':
        return 'Research Workspace'
      case 'researchWorkspace.description':
        return 'Окремий project-scoped продукт для research campaigns, grants і governed diagnostics'
      case 'dipWorkspace.title':
        return 'DIP Workspace'
      case 'dipWorkspace.description':
        return 'Data → Features → Research → Models → Decisions → System для нового DIP-шару'
      case 'translationModelChecks.title':
        return 'Перевірка моделей перекладу'
      case 'translationModelChecks.description':
        return 'Ручна технічна перевірка translator host, Helsinki, Facebook і compare'
      case 'speechDemo.title':
        return 'Демонстрація мовлення'
      case 'speechDemo.description':
        return 'Технічна сторінка для перевірки demo-сценаріїв мовлення'
      default:
        return key
    }
  },
}))

jest.mock('@/components/admin/DashboardItem', () => ({
  DashboardItem: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <article>
      <h3>{title}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
    </article>
  ),
}))

describe('Admin dashboard page', () => {
  it('renders research tools in a separate section from developer tools', () => {
    render(<AdminDashboardPage />)

    const companySection = screen.getByText('Компанії', { selector: 'section > h2' }).closest('section')
    const researchSection = screen.getByText('Дослідження', { selector: 'section > h2' }).closest('section')
    const toolsSection = screen.getByText('Інструменти', { selector: 'section > h2' }).closest('section')

    expect(companySection).not.toBeNull()
    expect(researchSection).not.toBeNull()
    expect(toolsSection).not.toBeNull()

    expect(within(companySection as HTMLElement).getByText('Суперюзер')).toBeInTheDocument()
    expect(within(researchSection as HTMLElement).getByText('Research Workspace')).toBeInTheDocument()
    expect(within(researchSection as HTMLElement).getByText('DIP Workspace')).toBeInTheDocument()
    expect(within(toolsSection as HTMLElement).getByText('Перевірка моделей перекладу')).toBeInTheDocument()
    expect(within(toolsSection as HTMLElement).getByText('Демонстрація мовлення')).toBeInTheDocument()

    expect(within(toolsSection as HTMLElement).queryByText('Research Workspace')).not.toBeInTheDocument()
    expect(within(toolsSection as HTMLElement).queryByText('DIP Workspace')).not.toBeInTheDocument()
  })
})
