import { describe, it, expect } from 'vitest';
import { generateMockSales, PRODUCTS } from '../mockData';

describe('Data Logic', () => {
  it('should generate 100 mock sales records', () => {
    const sales = generateMockSales();
    expect(sales).toHaveLength(100);
  });

  it('should have products with valid prices', () => {
    PRODUCTS.forEach(product => {
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it('should have unique product IDs', () => {
    const ids = PRODUCTS.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
