
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI } from "@google/genai";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const Dashboard: React.FC = () => {
  const { orders, customers, expenses, inventory } = useApp();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status !== 'Delivered');
  const lowStock = inventory.filter(i => i.stock <= i.lowStockThreshold);

  const generateAIInsight = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const statsContext = `
        Shop Performance Data:
        - Total Revenue: ₹${totalRevenue}
        - Total Customers: ${customers.length}
        - Pending Orders: ${pendingOrders.length}
        - Inventory Alerts: ${lowStock.length} items low on stock
        - Recent Expenses: ₹${expenses.reduce((s,e) => s + e.amount, 0)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: statsContext,
        config: {
          systemInstruction: "You are an expert fashion business consultant. Provide a concise, 2-sentence strategic recommendation for this tailor shop based on the data. Be encouraging and specific.",
        },
      });
      setAiInsight(response.text || "Keep up the great work! Focus on converting your pending orders to revenue.");
    } catch (error) {
      setAiInsight("Unable to generate insight at this time. Focus on completing pending orders.");
    } finally {
      setIsGenerating(false);
    }
  };

  const chartData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 2100 },
    { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 2400 },
    { name: 'Fri', revenue: 3600 },
    { name: 'Sat', revenue: 4500 },
    { name: 'Sun', revenue: 3000 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium">Real-time pulse of your tailoring boutique.</p>
        </div>
        
        {/* AI Insight Section */}
        <div className="relative group max-w-md w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              {aiInsight ? (
                <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                  "{aiInsight}"
                </p>
              ) : (
                <div>
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">AI Business Analyst</h4>
                  <button 
                    onClick={generateAIInsight}
                    disabled={isGenerating}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 underline decoration-indigo-200"
                  >
                    Generate performance insight
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={TrendingUp} color="bg-indigo-600" trend="+12.5%" />
        <StatCard title="Pending" value={pendingOrders.length} icon={ShoppingBag} color="bg-amber-500" />
        <StatCard title="Customers" value={customers.length} icon={Users} color="bg-emerald-500" />
        <StatCard title="Low Stock" value={lowStock.length} icon={AlertCircle} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-900 mb-8 text-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            Weekly Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-black text-slate-900 mb-6 text-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Live Tracker
          </h3>
          <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[320px]">
            {orders.slice(0, 10).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm
                    ${order.status === 'Delivered' ? 'bg-slate-900' : 'bg-indigo-600'}`}>
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-500 font-bold">{order.orderNumber} • {order.deliveryDate}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                  ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {order.status}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <ShoppingBag className="w-12 h-12 text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No orders tracked yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
