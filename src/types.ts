export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export interface SaleRecord {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  timestamp: string;
  customerId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  purchaseHistory: string[]; // Array of product IDs
}

export interface PredictionResult {
  customerId: string;
  recommendedProducts: string[]; // Array of product IDs
  reasoning: string;
}

export interface SalesInsight {
  trend: 'up' | 'down' | 'stable';
  message: string;
  confidence: number;
}
