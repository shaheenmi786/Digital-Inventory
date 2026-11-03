import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [binActionLoading, setBinActionLoading] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/reports/dashboard?timeframe=${timeframe}`);
      setData(res.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [timeframe]);

  const handleMoveToBin = async (productId: string) => {
    setBinActionLoading(productId);
    try {
      await api.post(`/bin/${productId}/move`);
      await fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to move product to Bin.');
    } finally {
      setBinActionLoading(null);
    }
  };

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    availableProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time Kirana analytics, inventory indicators, and active orders pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Filter Pills */}
          <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 flex items-center shadow-inner text-xs font-semibold">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  timeframe === t
                    ? 'bg-white dark:bg-[#151d30] text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/orders')}
            className="px-3.5 py-2 btn-3d-primary flex items-center gap-1.5 text-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> New Sale / POS
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* 3D Modern Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="card-3d card-3d-hover p-5 relative overflow-hidden bg-gradient-to-br from-white to-indigo-50/20 dark:from-[#151d30] dark:to-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            ₹{stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Net settled sales in selected period</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card-3d card-3d-hover p-5 relative overflow-hidden bg-gradient-to-br from-white to-blue-50/20 dark:from-[#151d30] dark:to-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Orders Processed
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-3">{stats.totalOrders}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {stats.allOrdersCount} lifetime shop orders
          </p>
        </div>

        {/* Total Products */}
        <div className="card-3d card-3d-hover p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Inventory
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-3">{stats.totalProducts}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Catalogued SKUs in Kirana database
          </p>
        </div>

        {/* Stock Availability Breakdown: Green / Yellow / Red */}
        <div className="card-3d card-3d-hover p-5 relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Stock Availability
          </span>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-1">
            {/* Green: Available */}
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto mb-1 animate-pulse" />
              <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                {stats.availableProducts}
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Available</span>
            </div>

            {/* Yellow: Low Stock */}
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mx-auto mb-1" />
              <p className="text-lg font-black text-amber-700 dark:text-amber-300">
                {stats.lowStockProducts}
              </p>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Low Stock</span>
            </div>

            {/* Red: Out of Stock */}
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-1" />
              <p className="text-lg font-black text-rose-700 dark:text-rose-300">
                {stats.outOfStockProducts}
              </p>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Out of Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Out-of-Stock Alert Card with Direct Action to Move to Bin */}
      {stats.outOfStockProducts > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Attention: {stats.outOfStockProducts} Product(s) are currently Out of Stock
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300/80">
                Customers cannot order items with zero stock. You can replenish or move them into the Bin to declutter your active catalog.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/inventory?stockStatus=OUT_OF_STOCK')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all whitespace-nowrap self-start sm:self-auto"
          >
            Review Out-of-Stock Items
          </button>
        </div>
      )}

      {/* Sales Trend Recharts Area Chart */}
      <div className="card-3d p-6 bg-white dark:bg-[#151d30]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Sales Performance & Revenue Trend
            </h3>
            <p className="text-xs text-slate-500">Live database sales chart ({timeframe})</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            INR (₹)
          </span>
        </div>

        <div className="h-64 w-full">
          {data?.salesChart && data.salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No sales recorded for this timeframe.
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card-3d p-6 bg-white dark:bg-[#151d30]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Live order pipeline with delivery deadlines & remaining time</p>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Delivery Status</th>
                <th className="pb-3">Remaining Time</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {data?.recentOrders && data.recentOrders.length > 0 ? (
                data.recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {ord.customer?.name || 'Walk-in Customer'}
                        </p>
                        <p className="text-[11px] text-slate-400">{ord.customer?.phone || 'Direct Sale'}</p>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {ord.items?.length || 0} items
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      ₹{ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : ord.status === 'CANCELLED'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {ord.deliveryDeadline && ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED' ? (
                        <div
                          className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                            ord.isOverdue ? 'text-red-500 font-bold' : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {ord.isOverdue
                              ? `Overdue (${Math.abs(ord.remainingMinutes)}m ago)`
                              : `${ord.remainingMinutes} mins remaining`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate(`/orders?orderId=${ord.id}`)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                    No orders recorded yet. Click "New Sale" to create your first order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
