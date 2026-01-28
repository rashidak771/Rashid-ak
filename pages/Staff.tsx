
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, UserCircle, Briefcase, Trash2 } from 'lucide-react';
import { User, UserRole } from '../types';

const Staff: React.FC = () => {
  const { users, setUsers, orders } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: UserRole.TAILOR, username: '', salary: 0 });

  const getWorkload = (id: string) => {
    return orders.filter(o => o.assignedTailorId === id && o.status !== 'Delivered').length;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff & Tailors</h1>
          <p className="text-slate-500">Manage your team and workloads</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {user.name.charAt(0)}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === UserRole.OWNER ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {user.role}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
            <p className="text-slate-400 text-sm mb-4">@{user.username}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Active Tasks</p>
                <p className="text-xl font-bold text-slate-900">{getWorkload(user.id)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Salary</p>
                <p className="text-xl font-bold text-slate-900">₹{user.salary || 0}</p>
              </div>
            </div>

            {user.role !== UserRole.OWNER && (
              <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
                <button className="flex-1 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50">Manage</button>
                <button 
                  onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                  className="p-2 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add Staff Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username (for login)</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                  value={newStaff.username}
                  onChange={e => setNewStaff({...newStaff, username: e.target.value.toLowerCase()})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.TAILOR}>Tailor</option>
                    <option value={UserRole.OWNER}>Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                    value={newStaff.salary}
                    onChange={e => setNewStaff({...newStaff, salary: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">Add Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
