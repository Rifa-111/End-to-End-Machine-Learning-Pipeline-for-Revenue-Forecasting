import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { PRODUCTS, CUSTOMERS, generateMockSales } from './mockData';
import { SaleRecord, SalesInsight, PredictionResult, Customer } from './types';
import { SalesTrendChart, CategoryDistributionChart } from './components/Charts';
import { PredictionCard } from './components/Predictions';
import { getSalesInsights, getCustomerPredictions } from './services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [sales] = useState<SaleRecord[]>(generateMockSales());
  const [insights, setInsights] = useState<SalesInsight[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(CUSTOMERS[0]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'customers'>('overview');

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const res = await getSalesInsights(sales, PRODUCTS);
      setInsights(res);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [sales]);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoadingPrediction(true);
      const res = await getCustomerPredictions(selectedCustomer, PRODUCTS);
      setPrediction(res);
      setLoadingPrediction(false);
    };
    fetchPrediction();
  }, [selectedCustomer]);

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalOrders = sales.length;
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <span className="font-bold text-xl tracking-tight">Predictive</span>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              activeTab === 'overview' ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              activeTab === 'customers' ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Users className="w-5 h-5" />
            Customers
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-900 rounded-2xl p-4 text-white">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Pro Plan</p>
            <p className="text-sm font-medium mb-3">Unlimited AI Insights</p>
            <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {activeTab === 'overview' ? 'Sales Overview' : 'Customer Intelligence'}
            </h1>
            <p className="text-gray-500 mt-1">Real-time predictive analytics for your business.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm">
              Last 30 Days
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
              Export Report
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: TrendingUp, color: 'text-emerald-600' },
                  { label: 'Total Orders', value: totalOrders, trend: '+8.2%', icon: TrendingUp, color: 'text-blue-600' },
                  { label: 'Avg. Order Value', value: `$${avgOrderValue.toFixed(2)}`, trend: '-2.1%', icon: TrendingDown, color: 'text-amber-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                      <span className={cn("text-sm font-bold mb-1", stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600')}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    Revenue Trend
                    <Info className="w-4 h-4 text-gray-400" />
                  </h3>
                  <SalesTrendChart sales={sales} products={PRODUCTS} />
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    Category Distribution
                    <Info className="w-4 h-4 text-gray-400" />
                  </h3>
                  <CategoryDistributionChart sales={sales} products={PRODUCTS} />
                </div>
              </div>

              {/* AI Insights Section */}
              <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    Predictive Insights
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Live</span>
                  </h3>
                </div>

                {loadingInsights ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {insights.map((insight, i) => (
                      <div key={i} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            insight.trend === 'up' ? "bg-emerald-100 text-emerald-600" : 
                            insight.trend === 'down' ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-600"
                          )}>
                            {insight.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                             insight.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {Math.round(insight.confidence * 100)}% Confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {insight.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="customers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer List */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-bottom border-gray-100">
                    <h3 className="font-bold text-gray-900">Select Customer</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {CUSTOMERS.map(customer => (
                      <button
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={cn(
                          "w-full p-6 text-left transition-colors flex items-center gap-4",
                          selectedCustomer.id === customer.id ? "bg-emerald-50" : "hover:bg-gray-50"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prediction View */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <PredictionCard 
                    prediction={prediction} 
                    products={PRODUCTS} 
                    customer={selectedCustomer} 
                    loading={loadingPrediction} 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
