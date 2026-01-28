
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingDown, Plus, Trash2, Calendar } from 'lucide-react';
import { Expense } from '../types';

const Expenses: React.FC = () => {
  const { expenses, setExpenses } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'Rent', amount: 0, description: '', date: new Date().toISOString().split('T')[0] });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Expense = {
      id: Date.now().toString(),
      ...newExpense
    };
    setExpenses([item, ...expenses]);
    setIsModalOpen(false);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500">Monitor shop operational costs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Record Expense
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Expenditures</p>
          <p className="text-3xl font-bold text-rose-600 mt-1">₹{total.toLocaleString()}</p>
        </div>
        <TrendingDown className="w-12 h-12 text-rose-100" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {e.date}
                </td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold">{e.category}</span></td>
                <td className="px-6 py-4 text-slate-700">{e.description}</td>
                <td className="px-6 py-4 font-bold text-rose-600">₹{e.amount}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setExpenses(expenses.filter(item => item.id !== e.id))} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400">No expenses recorded yet.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">New Expense</h2>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <input required className="w-full p-2 border rounded-lg bg-slate-50" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select className="w-full p-2 border rounded-lg bg-slate-50" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    <option>Rent</option>
                    <option>Salary</option>
                    <option>Electricity</option>
                    <option>Raw Material</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Amount (₹)</label>
                  <input type="number" required className="w-full p-2 border rounded-lg bg-slate-50" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Date</label>
                <input type="date" className="w-full p-2 border rounded-lg bg-slate-50" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold">Record Expense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
