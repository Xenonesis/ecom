import { signUpSchema, productSchema } from '@/lib/validations/schemas';

describe('Validation Schemas', () => {
  describe('signUpSchema', () => {
    it('should validate correct signup data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        role: 'customer' as const,
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject weak passwords', () => {
      const weakPassword = {
        email: 'test@example.com',
        password: 'weak',
        role: 'customer' as const,
      };

      const result = signUpSchema.safeParse(weakPassword);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidEmail = {
        email: 'not-an-email',
        password: 'Password123',
        role: 'customer' as const,
      };

      const result = signUpSchema.safeParse(invalidEmail);
      expect(result.success).toBe(false);
    });
  });

  describe('productSchema', () => {
    it('should validate correct product data', () => {
      const validProduct = {
        name: 'Test Product',
        description: 'A great product for testing',
        price: 99.99,
        stock_quantity: 10,
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        images: ['https://example.com/image.jpg'],
      };

      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const invalidProduct = {
        name: 'Test Product',
        description: 'A great product for testing',
        price: -10,
        stock_quantity: 10,
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        images: ['https://example.com/image.jpg'],
      };

      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });
});
