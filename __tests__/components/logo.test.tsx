import { render } from '@testing-library/react'
import { Logo } from '@/components/logo'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
  }),
}))

describe('Logo', () => {
  it('renders full logo by default', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders icon only variant', () => {
    const { container } = render(<Logo variant="icon" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders text only variant', () => {
    const { getByText } = render(<Logo variant="text" />)
    expect(getByText('ShopHub')).toBeInTheDocument()
  })

  it('applies custom size', () => {
    const { container } = render(<Logo size={60} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '60')
    expect(svg).toHaveAttribute('height', '60')
  })

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})