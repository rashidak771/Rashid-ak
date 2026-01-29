
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, UserCircle, Briefcase, Trash2, Wallet, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { User, UserRole, Expense } from '../types';

const Staff: React.FC = () => {
  const { users, setUsers, orders, expenses, setExpenses } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: UserRole.TAILOR, username: '', salary: 0 });

  const getPerformance = (id: string) => {
    const tailorOrders = orders.filter(o => o.assignedTailorId === id);
    const active = tailorOrders.filter(o => o.status !== 'Delivered').length;
    const completed = tailorOrders.filter(o => o.status === 'Delivered').length;
    const completionRate = tailorOrders.length > 0 ? Math.round((completed / tailorOrders.length) * 100) : 0;
    return { active, completed, completionRate };
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Date.now().toString(),
      ...newStaff
    };
    setUsers([...users, user]);
    setIsModalOpen(false);
  };

  const paySalary = (user: User) => {
    if (!user.salary) return;
    
    const confirmPay = confirm(`Pay salary of ₹${user.salary} to ${user.name}? This will be recorded as an expense.`);
    if (!confirmPay) return;

    const salaryExpense: Expense = {
      id: `sal-${Date.now()}`,
      category: 'Salary',
      amount: user.salary,
      date: new Date().toISOString().split('T')[0],
      description: `Monthly salary for ${user.name} (${new Date().toLocaleString('default', { month: 'long' })})`
    };

    setExpenses([salaryExpense, ...expenses]);
    setUsers(users.map(u => u.id === user.id ? { ...u, lastSalaryPaid: new Date().toISOString().split('T')[0] } : u));
    alert("Salary payment recorded successfully!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff & Craftsmen</h1>
          <p className="text-slate-500 font-medium">Manage human capital and workshop performance</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95 font-black uppercase text-xs tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const stats = getPerformance(user.id);
          return (
            <div key={user.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex flex-col">
              <div className="p-8 border-b border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100">
                    {user.name.charAt(0)}
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.role === UserRole.OWNER ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                    {user.role}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">@{user.username}</p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stats.completionRate}% Efficiency</span>
                </div>
              </div>
              
              <div className="p-8 bg-slate-50/50 flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Assigned</p>
                    <p className="text-2xl font-black text-slate-900">{stats.active}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> Finished</p>
                    <p className="text-2xl font-black text-slate-900">{stats.completed}</p>
                  </div>
                </div>

                {user.salary && (
                  <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Base Salary</p>
                      <p className="text-lg font-black text-indigo-600">₹{user.salary.toLocaleString()}</p>
                    </div>
                    {user.lastSalaryPaid && (
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Last Paid</p>
                        <p className="text-xs font-bold text-slate-500">{user.lastSalaryPaid}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-slate-100 mt-auto">
                <div className="flex gap-3">
                  {user.role !== UserRole.OWNER && (
                    <>
                      <button 
                        onClick={() => paySalary(user)}
                        className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Wallet className="w-4 h-4" /> Disburse Salary
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm("Permanently remove this staff member?")) {
                            setUsers(users.filter(u => u.id !== user.id));
                          }
                        }}
                        className="p-3.5 border-2 border-slate-100 rounded-xl text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {user.role === UserRole.OWNER && (
                    <button className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-default">
                      Primary Administrator
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-white/10">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                  <UserCircle className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Onboard Staff</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-400 transition-all shadow-sm">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black shadow-sm"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  placeholder="Master Tailor Name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Access Credentials (Username)</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black shadow-sm"
                  value={newStaff.username}
                  onChange={e => setNewStaff({...newStaff, username: e.target.value.toLowerCase()})}
                  placeholder="e.g. johndoe"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Work Group</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black appearance-none shadow-sm"
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.TAILOR}>Workshop/Tailor</option>
                    <option value={UserRole.OWNER}>Management/Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Monthly Payroll (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black shadow-sm"
                    value={newStaff.salary}
                    onChange={e => setNewStaff({...newStaff, salary: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all uppercase tracking-widest text-[10px] active:scale-95"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
