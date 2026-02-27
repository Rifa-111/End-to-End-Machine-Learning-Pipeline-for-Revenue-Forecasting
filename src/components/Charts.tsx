import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { SaleRecord, Product } from '../types';
import { format, parseISO } from 'date-fns';

interface ChartsProps {
  sales: SaleRecord[];
  products: Product[];
}

export const SalesTrendChart: React.FC<ChartsProps> = ({ sales }) => {
  const data = React.useMemo(() => {
    const dailyMap = new Map<string, number>();
    sales.forEach(s => {
      const date = format(parseISO(s.timestamp), 'MMM dd');
      dailyMap.set(date, (dailyMap.get(date) || 0) + s.totalPrice);
    });
    return Array.from(dailyMap.entries()).map(([date, total]) => ({ date, total }));
  }, [sales]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#10B981" 
            strokeWidth={2} 
            dot={{ r: 4, fill: '#10B981' }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryDistributionChart: React.FC<ChartsProps> = ({ sales, products }) => {
  const data = React.useMemo(() => {
    const catMap = new Map<string, number>();
    sales.forEach(s => {
      const p = products.find(prod => prod.id === s.productId);
      const cat = p?.category || 'Other';
      catMap.set(cat, (catMap.get(cat) || 0) + s.totalPrice);
    });
    return Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));
  }, [sales, products]);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
