import { Product, SaleRecord, Customer } from './types';
import { subDays, format } from 'date-fns';

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Premium Wireless Headphones', category: 'Electronics', price: 299.99, stock: 45, image: 'https://picsum.photos/seed/headphones/400/300' },
  { id: 'p2', name: 'Smart Fitness Watch', category: 'Electronics', price: 199.99, stock: 120, image: 'https://picsum.photos/seed/watch/400/300' },
  { id: 'p3', name: 'Organic Cotton T-Shirt', category: 'Apparel', price: 35.00, stock: 500, image: 'https://picsum.photos/seed/tshirt/400/300' },
  { id: 'p4', name: 'Ergonomic Office Chair', category: 'Furniture', price: 450.00, stock: 15, image: 'https://picsum.photos/seed/chair/400/300' },
  { id: 'p5', name: 'Stainless Steel Water Bottle', category: 'Home', price: 25.00, stock: 250, image: 'https://picsum.photos/seed/bottle/400/300' },
  { id: 'p6', name: 'Noise Cancelling Earbuds', category: 'Electronics', price: 149.99, stock: 80, image: 'https://picsum.photos/seed/earbuds/400/300' },
  { id: 'p7', name: 'Leather Messenger Bag', category: 'Apparel', price: 120.00, stock: 30, image: 'https://picsum.photos/seed/bag/400/300' },
  { id: 'p8', name: 'Mechanical Keyboard', category: 'Electronics', price: 159.99, stock: 55, image: 'https://picsum.photos/seed/keyboard/400/300' },
];

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', purchaseHistory: ['p1', 'p2', 'p8'] },
  { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', purchaseHistory: ['p3', 'p5'] },
  { id: 'c3', name: 'Charlie Davis', email: 'charlie@example.com', purchaseHistory: ['p4', 'p8'] },
];

export const generateMockSales = (): SaleRecord[] => {
  const sales: SaleRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = subDays(now, daysAgo);
    
    sales.push({
      id: `s${i}`,
      productId: product.id,
      customerId: customer.id,
      quantity: Math.floor(Math.random() * 3) + 1,
      totalPrice: product.price * (Math.floor(Math.random() * 3) + 1),
      timestamp: date.toISOString(),
    });
  }
  
  return sales.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};
