import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/product-card';

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  }))
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  discount: 10,
  images: ['https://example.com/image.jpg'],
  rating: 4.5,
  stock: 10,
  category: 'electronics',
  seller_id: 'seller1',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/99\.99/)).toBeInTheDocument();
  });

  it('displays discount badge when discount exists', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(/10% OFF/i)).toBeInTheDocument();
  });

  it('shows out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    const outOfStockElements = screen.getAllByText(/out of stock/i);
    expect(outOfStockElements.length).toBeGreaterThan(0);
  });
});
