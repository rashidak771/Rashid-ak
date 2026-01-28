
import React from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, DollarSign, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

const Payments: React.FC = () => {
  const { orders } = useApp();

  const stats = orders.reduce((acc, o) => {
    acc.total += o.totalAmount;
    acc.paid += o.advancePaid + (o.status === 'Delivered' ? (o.totalAmount - o.advancePaid) : 0);
    return acc;
  }, { total: 0, paid: 0 });

  const outstanding = stats.total - stats.paid;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments & Ledger</h1>
        <p className="text-slate-500">Detailed financial records per order</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-xl shadow-sm text-white">
          <p className="text-indigo-100 text-sm font-medium">Expected Revenue</p>
          <p className="text-3xl font-black mt-1">₹{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-500 p-6 rounded-xl shadow-sm text-white">
          <p className="text-emerald-100 text-sm font-medium">Collected Cash</p>
          <p className="text-3xl font-black mt-1">₹{stats.paid.toLocaleString()}</p>
        </div>
        <div className="bg-rose-500 p-6 rounded-xl shadow-sm text-white">
          <p className="text-rose-100 text-sm font-medium">Pending Dues</p>
          <p className="text-3xl font-black mt-1">₹{outstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Order #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => {
              const balance = o.totalAmount - (o.advancePaid + (o.status === 'Delivered' ? (o.totalAmount - o.advancePaid) : 0));
              return (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-400">{o.orderNumber}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{o.customerName}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{o.totalAmount}</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">₹{o.totalAmount - balance}</td>
                  <td className="px-6 py-4 text-rose-500 font-bold">₹{balance}</td>
                  <td className="px-6 py-4">
                    {balance === 0 ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Full Paid</span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 text-xs font-bold"><Clock className="w-4 h-4" /> Partial</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-10" />
            <p>No payment records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
