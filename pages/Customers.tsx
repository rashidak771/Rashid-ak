
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, User, Phone, Mail, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Customer } from '../types';

const Customers: React.FC = () => {
  const { customers, setCustomers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    // Check for duplicate phone
    if (customers.some(c => c.phone === newCustomer.phone)) {
      alert("Customer with this phone number already exists!");
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setIsModalOpen(false);
  };

  const deleteCustomer = (id: string) => {
    if (confirm("Are you sure you want to delete this customer? All their history will be lost.")) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500">Manage your client database</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-slate-700"><Phone className="w-3 h-3"/> {customer.phone}</span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs"><Mail className="w-3 h-3"/> {customer.email || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {customer.address || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteCustomer(customer.id)}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No customers found.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">New Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                <input 
                  required
                  type="tel" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={newCustomer.email}
                  onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 h-24"
                  value={newCustomer.address}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
