
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Trash2, 
  Edit, 
  X, 
  History, 
  ExternalLink,
  MapPin,
  Calendar,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Customer, Order } from '../types';

const Customers: React.FC = () => {
  const { customers, setCustomers, orders } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

  // Robust Search Logic
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (c.name || '').toLowerCase().includes(term) || 
      (c.phone || '').includes(term) ||
      (c.email || '').toLowerCase().includes(term)
    );
  });

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ 
        name: customer.name, 
        phone: customer.phone, 
        email: customer.email || '', 
        address: customer.address || '' 
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', phone: '', email: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleViewHistory = (customer: Customer) => {
    setViewingCustomer(customer);
    setExpandedYears({}); // Reset expanded states
    setIsHistoryOpen(true);
  };

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Name and Phone are required.");
      return;
    }

    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id ? { ...c, ...formData } : c
      ));
    } else {
      if (customers.some(c => c.phone.trim() === formData.phone.trim())) {
        alert("Customer with this phone number already exists!");
        return;
      }
      const customer: Customer = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCustomers([...customers, customer]);
    }

    setIsModalOpen(false);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  const deleteCustomer = (id: string) => {
    if (confirm("Are you sure you want to delete this customer? All their history will be lost.")) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  // Grouped History Logic
  const yearlyHistory = useMemo(() => {
    if (!viewingCustomer) return {};
    const customerOrders = orders.filter(o => o.customerId === viewingCustomer.id);
    
    return customerOrders.reduce((acc, order) => {
      const year = new Date(order.createdAt).getFullYear();
      if (!acc[year]) {
        acc[year] = { orders: [], totalSpend: 0, count: 0 };
      }
      acc[year].orders.push(order);
      acc[year].totalSpend += order.totalAmount;
      acc[year].count += 1;
      return acc;
    }, {} as Record<number, { orders: Order[], totalSpend: number, count: number }>);
  }, [viewingCustomer, orders]);

  // Sort years descending
  const sortedYears = Object.keys(yearlyHistory).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500">Manage client data and order history</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search name, phone, or email..." 
              className="pl-12 pr-4 py-2.5 w-full rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Member Since</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{customer.name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {customer.address || 'No address set'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-indigo-500"/> {customer.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-indigo-400"/> {customer.email || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {customer.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => handleViewHistory(customer)}
                        className="p-2.5 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all"
                        title="View History"
                      >
                        <History className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(customer)}
                        className="p-2.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
                        title="Edit Details"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteCustomer(customer.id)}
                        className="p-2.5 hover:bg-rose-100 text-rose-500 rounded-xl transition-all"
                        title="Delete"
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
            <div className="py-24 text-center">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Customers Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your search or add a new customer to your database.</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-md:max-w-md overflow-hidden ring-1 ring-white/10">
            <div className="p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCustomer ? 'Update Profile' : 'New Customer'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors bg-white p-2 rounded-full border border-slate-100 hover:border-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCustomer} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name *</label>
                <input 
                  required
                  autoFocus
                  type="text" 
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number *</label>
                <input 
                  required
                  type="tel" 
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="Mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="For receipts and updates"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Postal Address</label>
                <textarea 
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium h-28 resize-none placeholder:text-slate-400"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Delivery address details..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  {editingCustomer ? 'Update Profile' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HISTORY MODAL (REFACTORED) */}
      {isHistoryOpen && viewingCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden h-[85vh] flex flex-col">
            <div className="p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {viewingCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{viewingCustomer.name}</h2>
                  <p className="text-slate-500 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {viewingCustomer.phone}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-7 no-scrollbar space-y-8">
              {/* Profile Overview Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Contact</label>
                  <p className="text-slate-700 font-semibold">{viewingCustomer.email || 'No email registered'}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Registered Address</label>
                  <p className="text-slate-700 font-semibold leading-relaxed line-clamp-2">{viewingCustomer.address || 'Address not provided'}</p>
                </div>
              </div>

              {/* REFACTORED Order History with Grouping */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                    <ShoppingBag className="w-6 h-6 text-indigo-600" /> 
                    Engagement Ledger
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black">
                    {orders.filter(o => o.customerId === viewingCustomer.id).length} Orders Total
                  </div>
                </div>
                
                <div className="space-y-4">
                  {sortedYears.length > 0 ? (
                    sortedYears.map(year => {
                      const data = yearlyHistory[year];
                      const isExpanded = expandedYears[year];

                      return (
                        <div key={year} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-indigo-100 transition-all">
                          {/* Year Summary Header */}
                          <button 
                            onClick={() => toggleYear(year)}
                            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isExpanded ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}
                          >
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                {isExpanded ? <ChevronDown className="w-5 h-5 text-indigo-600" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                <span className="text-2xl font-black text-slate-900">{year}</span>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</span>
                                  <span className="text-sm font-bold text-slate-700">{data.count} Projects</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yearly Spend</span>
                                  <span className="text-sm font-black text-emerald-600">₹{data.totalSpend.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <TrendingUp className={`w-6 h-6 ${isExpanded ? 'text-indigo-200' : 'text-slate-100'} transition-colors`} />
                          </button>

                          {/* Individual Orders List */}
                          {isExpanded && (
                            <div className="p-5 space-y-4 bg-slate-50/30">
                              {data.orders.map(order => (
                                <div key={order.id} className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-lg relative">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <span className="font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase text-xs">{order.orderNumber}</span>
                                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm
                                      ${order.status === 'Delivered' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                                      {order.status}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-1.5 mb-5">
                                    {order.items.map((item, idx) => (
                                      <span key={idx} className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-600 uppercase">
                                        {item.serviceName}
                                      </span>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex gap-6">
                                      <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Value</p>
                                        <p className="text-sm font-black text-slate-900">₹{order.totalAmount}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Settled</p>
                                        <p className="text-sm font-black text-emerald-600">₹{order.advancePaid + (order.status === 'Delivered' ? order.totalAmount - order.advancePaid : 0)}</p>
                                      </div>
                                    </div>
                                    <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all">
                                      Receipt <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-slate-50 py-20 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                      <ShoppingBag className="w-16 h-16 mx-auto text-slate-200 mb-6" />
                      <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">Zero transactional history detected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => {setIsHistoryOpen(false); handleOpenModal(viewingCustomer);}}
                className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
              <button 
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 text-xs uppercase tracking-widest active:scale-95"
              >
                Book New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
