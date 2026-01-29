
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  ArrowRight, 
  X, 
  AlertCircle,
  Receipt,
  Check
} from 'lucide-react';
import { Order } from '../types';

const Payments: React.FC = () => {
  const { orders, setOrders } = useApp();
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);

  const stats = orders.reduce((acc, o) => {
    const paidAmount = o.advancePaid + (o.status === 'Delivered' ? (o.totalAmount - o.advancePaid) : 0);
    acc.total += o.totalAmount;
    acc.paid += paidAmount;
    return acc;
  }, { total: 0, paid: 0 });

  const outstanding = stats.total - stats.paid;

  const handleSettlePayment = (order: Order) => {
    setConfirmingOrder(order);
  };

  const finalizePayment = () => {
    if (!confirmingOrder) return;

    setOrders(orders.map(o => {
      if (o.id === confirmingOrder.id) {
        return {
          ...o,
          advancePaid: o.totalAmount // Mark as fully paid
        };
      }
      return o;
    }));
    setConfirmingOrder(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Payments & Ledger</h1>
          <p className="text-slate-500 font-medium">Manage cash flow and outstanding balances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <p className="text-indigo-100 text-xs font-black uppercase tracking-[0.2em]">Expected Revenue</p>
          <p className="text-4xl font-black text-white mt-2">₹{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-500 p-8 rounded-[2rem] shadow-xl shadow-emerald-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <p className="text-emerald-100 text-xs font-black uppercase tracking-[0.2em]">Collected Cash</p>
          <p className="text-4xl font-black text-white mt-2">₹{stats.paid.toLocaleString()}</p>
        </div>
        <div className="bg-rose-500 p-8 rounded-[2rem] shadow-xl shadow-rose-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <p className="text-rose-100 text-xs font-black uppercase tracking-[0.2em]">Pending Dues</p>
          <p className="text-4xl font-black text-white mt-2">₹{outstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Order Reference</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Order Total</th>
                <th className="px-8 py-5">Paid to Date</th>
                <th className="px-8 py-5">Balance</th>
                <th className="px-8 py-5">Payment Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => {
                const isFullyPaid = o.advancePaid >= o.totalAmount || o.status === 'Delivered';
                const balance = isFullyPaid ? 0 : o.totalAmount - o.advancePaid;
                const paid = o.totalAmount - balance;

                return (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-black text-slate-400 group-hover:text-indigo-600 transition-colors">{o.orderNumber}</span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-900">{o.customerName}</td>
                    <td className="px-8 py-5 font-black text-slate-900">₹{o.totalAmount}</td>
                    <td className="px-8 py-5 text-emerald-600 font-black">₹{paid}</td>
                    <td className="px-8 py-5 text-rose-500 font-black">₹{balance}</td>
                    <td className="px-8 py-5">
                      {balance === 0 ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Full Paid
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit border border-amber-100">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {balance > 0 && (
                        <button 
                          onClick={() => handleSettlePayment(o)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100"
                        >
                          Settle
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No payment records found yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-white/10">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Confirm Payment</h2>
              </div>
              <button 
                onClick={() => setConfirmingOrder(null)} 
                className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Transaction Summary</span>
                  <span className="font-black text-indigo-600 text-xs px-2 py-1 bg-white rounded-lg shadow-sm">{confirmingOrder.orderNumber}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Customer</span>
                    <span className="text-slate-900 font-black">{confirmingOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Order Total</span>
                    <span className="text-slate-900 font-black">₹{confirmingOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Already Paid</span>
                    <span className="text-emerald-600 font-black">₹{confirmingOrder.advancePaid}</span>
                  </div>
                  <div className="pt-3 border-t border-indigo-100 flex justify-between items-center">
                    <span className="text-slate-900 font-black uppercase text-xs tracking-widest">Collect Balance</span>
                    <span className="text-2xl font-black text-indigo-600">₹{confirmingOrder.totalAmount - confirmingOrder.advancePaid}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  Please verify that you have received the cash or digital payment before confirming. This transaction will be marked as finalized.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmingOrder(null)}
                  className="flex-1 py-4 rounded-2xl border-2 border-slate-100 font-black text-slate-400 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={finalizePayment}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-95"
                >
                  <Check className="w-4 h-4" /> Confirm & Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
