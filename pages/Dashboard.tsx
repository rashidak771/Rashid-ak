
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const { orders, customers, expenses, inventory } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingOrders = orders.filter(o => o.status !== 'Delivered');
  const lowStock = inventory.filter(i => i.stock <= i.lowStockThreshold);

  // Chart Data: Last 7 days orders (mocked for demo)
  const chartData = [
    { name: 'Mon', orders: 4, revenue: 1200 },
    { name: 'Tue', orders: 7, revenue: 2100 },
    { name: 'Wed', orders: 5, revenue: 1500 },
    { name: 'Thu', orders: 8, revenue: 2400 },
    { name: 'Fri', orders: 12, revenue: 3600 },
    { name: 'Sat', orders: 15, revenue: 4500 },
    { name: 'Sun', orders: 10, revenue: 3000 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Store Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-indigo-600" 
          trend="+12%" 
        />
        <StatCard 
          title="Active Orders" 
          value={pendingOrders.length} 
          icon={ShoppingBag} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Total Customers" 
          value={customers.length} 
          icon={Users} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStock.length} 
          icon={AlertCircle} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-6">Revenue Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-6">Recent Deliveries</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <CheckCircle2 className={`w-5 h-5 ${order.status === 'Delivered' ? 'text-emerald-500' : 'text-slate-300'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.orderNumber} • {order.deliveryDate}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {order.status}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-slate-500 py-10">No recent orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
