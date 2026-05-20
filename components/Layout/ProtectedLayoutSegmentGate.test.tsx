import { render, screen } from '@testing-library/react'

import ProtectedLayoutSegmentGate from '@/components/Layout/ProtectedLayoutSegmentGate'
import { usePathname } from '@/i18n/navigation'

jest.mock('@/i18n/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('ProtectedLayoutSegmentGate', () => {
  it('renders detached content for research routes', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/research/projects')

    render(
      <ProtectedLayoutSegmentGate
        detachedPrefix="/research"
        detachedContent={<div>Research shell</div>}
        defaultContent={<div>Default shell</div>}
      />
    )

    expect(screen.getByText('Research shell')).toBeInTheDocument()
    expect(screen.queryByText('Default shell')).not.toBeInTheDocument()
  })

  it('renders default content for non-research routes', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/my-space')

    render(
      <ProtectedLayoutSegmentGate
        detachedPrefix="/research"
        detachedContent={<div>Research shell</div>}
        defaultContent={<div>Default shell</div>}
      />
    )

    expect(screen.getByText('Default shell')).toBeInTheDocument()
    expect(screen.queryByText('Research shell')).not.toBeInTheDocument()
  })
})
