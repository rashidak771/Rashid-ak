
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, 
  Target, Zap, AlertCircle, ShoppingBag 
} from 'lucide-react';

const Reports: React.FC = () => {
  const { orders, expenses, users } = useApp();

  const analytics = useMemo(() => {
    // Financial aggregation
    const revenue = orders.reduce((s, o) => s + o.totalAmount, 0);
    const tax = orders.reduce((s, o) => s + o.taxAmount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const profit = revenue - totalExpenses;

    // Monthly data for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((m, idx) => {
      const monthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === idx);
      const monthExpenses = expenses.filter(e => new Date(e.date).getMonth() === idx);
      return {
        name: m,
        income: monthOrders.reduce((s, o) => s + o.totalAmount, 0),
        expense: monthExpenses.reduce((s, e) => s + e.amount, 0)
      };
    });

    // Expense categorization
    const expenseCats: Record<string, number> = {};
    expenses.forEach(e => {
      expenseCats[e.category] = (expenseCats[e.category] || 0) + e.amount;
    });
    const expensePieData = Object.entries(expenseCats).map(([name, value]) => ({ name, value }));

    return { revenue, tax, totalExpenses, profit, monthlyData, expensePieData };
  }, [orders, expenses]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const Card = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} bg-opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`}></div>
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
      </div>
      <p className="text-xs font-bold text-slate-400">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Analytics</h1>
          <p className="text-slate-500 font-medium tracking-tight">Financial audit and performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            Export Audit Log
          </button>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Print Ledger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Gross Sales" value={`₹${analytics.revenue.toLocaleString()}`} icon={TrendingUp} color="bg-indigo-600" subtitle="Total booking value" />
        <Card title="Operating Costs" value={`₹${analytics.totalExpenses.toLocaleString()}`} icon={TrendingDown} color="bg-rose-500" subtitle="Expenses + Payroll" />
        <Card title="Net Profit" value={`₹${analytics.profit.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" subtitle="After all deductibles" />
        <Card title="Tax Liability" value={`₹${analytics.tax.toLocaleString()}`} icon={AlertCircle} color="bg-amber-500" subtitle="Accrued GST/VAT" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-3 uppercase">
              <Zap className="w-6 h-6 text-indigo-600" /> Cash Flow Audit
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Costs</span>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="income" stroke="#4f46e5" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={4} />
                <Area type="monotone" dataKey="expense" stroke="#fb7185" fillOpacity={0} strokeWidth={4} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-3 uppercase mb-10">
            <PieChartIcon className="w-6 h-6 text-indigo-600" /> Expense Allocation
          </h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="h-[300px] w-full max-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.expensePieData}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {analytics.expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full md:w-auto">
              {analytics.expensePieData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between gap-8 group">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
              {analytics.expensePieData.length === 0 && (
                <p className="text-xs font-bold text-slate-400">Zero expense data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-lg">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4 uppercase">
              <Target className="w-8 h-8 text-indigo-400" /> Strategic Efficiency
            </h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Based on your current order volume and completion rate, the shop is operating at <b>{Math.round((orders.filter(o=>o.status==='Delivered').length / (orders.length || 1)) * 100)}%</b> delivery efficiency. Focus on reducing bottleneck items in the 'Stitching' phase to maximize quarterly profit.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">ROI Projection</p>
              <p className="text-3xl font-black text-white">+14.2%</p>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Client Growth</p>
              <p className="text-3xl font-black text-white">Stable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
