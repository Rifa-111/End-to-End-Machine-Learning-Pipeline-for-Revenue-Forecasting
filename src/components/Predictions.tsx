import React from 'react';
import { Product, PredictionResult, Customer } from '../types';
import { Sparkles, ShoppingCart, User } from 'lucide-react';
import { motion } from 'motion/react';

interface PredictionsProps {
  prediction: PredictionResult | null;
  products: Product[];
  customer: Customer;
  loading: boolean;
}

export const PredictionCard: React.FC<PredictionsProps> = ({ prediction, products, customer, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const recommended = prediction.recommendedProducts
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">Personalized Recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          AI Powered
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-sm text-gray-600">
        "{prediction.reasoning}"
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommended.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-emerald-600 font-semibold">${product.price}</span>
              <button className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
