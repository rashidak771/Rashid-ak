
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Calendar, Package, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderStatus, UserRole } from '../types';

const Orders: React.FC = () => {
  const { orders, setOrders, customers, services, users, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');

  const [formData, setFormData] = useState({
    customerId: '',
    serviceId: '',
    advance: 0,
    deliveryDate: '',
    tailorId: ''
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    const service = services.find(s => s.id === formData.serviceId);
    const tailor = users.find(u => u.id === formData.tailorId);

    if (!customer || !service) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerId: customer.id,
      customerName: customer.name,
      items: [{
        serviceId: service.id,
        serviceName: service.name,
        quantity: 1,
        price: service.basePrice
      }],
      totalAmount: service.basePrice,
      advancePaid: Number(formData.advance),
      status: OrderStatus.PENDING,
      deliveryDate: formData.deliveryDate,
      assignedTailorId: tailor?.id,
      assignedTailorName: tailor?.name,
      createdAt: new Date().toISOString(),
      taxAmount: 0 // Logic for tax can be added here
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const filteredOrders = orders.filter(o => 
    filter === 'All' ? true : o.status === filter
  ).filter(o => {
    if (currentUser?.role === UserRole.TAILOR) {
      return o.assignedTailorId === currentUser.id;
    }
    return true;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-slate-100 text-slate-600';
      case OrderStatus.IN_PROGRESS: return 'bg-blue-50 text-blue-600';
      case OrderStatus.STITCHING: return 'bg-indigo-50 text-indigo-600';
      case OrderStatus.READY: return 'bg-emerald-50 text-emerald-600';
      case OrderStatus.DELIVERED: return 'bg-slate-900 text-white';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500">Track and manage sewing projects</p>
        </div>
        {currentUser?.role === UserRole.OWNER && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit"
          >
            <Plus className="w-5 h-5" />
            Create New Order
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', ...Object.values(OrderStatus)].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
            `}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.orderNumber}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{order.customerName}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {order.items.map(i => i.serviceName).join(', ')}
              </p>
            </div>
            
            <div className="p-5 bg-slate-50 flex-1 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-4 h-4" /> Due Date</span>
                <span className="font-semibold text-slate-900">{order.deliveryDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1"><Package className="w-4 h-4" /> Total Amount</span>
                <span className="font-bold text-slate-900">₹{order.totalAmount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Balance</span>
                <span className="font-bold text-rose-500">₹{order.totalAmount - order.advancePaid}</span>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <select 
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                >
                  {Object.values(OrderStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              {order.assignedTailorName && (
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <span>Assigned to:</span>
                  <span className="font-medium text-slate-600">{order.assignedTailorName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <Package className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="text-slate-500">No orders found for the selected status.</p>
        </div>
      )}

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create New Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer *</label>
                  <select 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    value={formData.customerId}
                    onChange={e => setFormData({...formData, customerId: e.target.value})}
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>
                
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Type *</label>
                  <select 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    value={formData.serviceId}
                    onChange={e => setFormData({...formData, serviceId: e.target.value})}
                  >
                    <option value="">Select Service</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} - ₹{s.basePrice}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Advance Payment (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    value={formData.advance}
                    onChange={e => setFormData({...formData, advance: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Date *</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    value={formData.deliveryDate}
                    onChange={e => setFormData({...formData, deliveryDate: e.target.value})}
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign Tailor</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    value={formData.tailorId}
                    onChange={e => setFormData({...formData, tailorId: e.target.value})}
                  >
                    <option value="">Select Tailor</option>
                    {users.filter(u => u.role === UserRole.TAILOR).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
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
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
