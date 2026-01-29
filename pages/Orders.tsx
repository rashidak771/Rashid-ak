
import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Calendar, 
  Package, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Minus,
  ShoppingCart,
  X,
  Ruler,
  Printer,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus, UserRole, Measurement } from '../types';
import { MOCK_SHIRT_FIELDS, MOCK_PANT_FIELDS } from '../constants';

const Orders: React.FC = () => {
  const { orders, setOrders, customers, services, users, currentUser, measurements, setMeasurements, shopSettings } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickMeasureOpen, setIsQuickMeasureOpen] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  
  // Quick Measure State
  const [activeMeasureItemIndex, setActiveMeasureItemIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ serviceId: '', quantity: 1 }],
    advance: 0,
    deliveryDate: '',
    tailorId: ''
  });

  const baseAmount = useMemo(() => {
    return formData.items.reduce((sum, item) => {
      const service = services.find(s => s.id === item.serviceId);
      return sum + (service ? service.basePrice * item.quantity : 0);
    }, 0);
  }, [formData.items, services]);

  const taxAmount = useMemo(() => {
    return (baseAmount * (shopSettings.taxRate || 0)) / 100;
  }, [baseAmount, shopSettings.taxRate]);

  const totalAmount = baseAmount + taxAmount;

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { serviceId: '', quantity: 1 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems.length ? newItems : [{ serviceId: '', quantity: 1 }] });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const checkMeasurementExists = (customerId: string, serviceId: string) => {
    if (!customerId || !serviceId) return false;
    const service = services.find(s => s.id === serviceId);
    if (!service) return false;
    
    // Simplistic mapping: check if measurement type matches service category (Shirt/Pant)
    return measurements.some(m => 
      m.customerId === customerId && 
      m.type.toLowerCase() === service.category.toLowerCase()
    );
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    const tailor = users.find(u => u.id === formData.tailorId);

    if (!customer) {
      alert("Please select a customer.");
      return;
    }

    if (formData.items.some(i => !i.serviceId)) {
      alert("Please select a service for all items.");
      return;
    }

    // Measurement Validation
    for (const item of formData.items) {
      if (!checkMeasurementExists(customer.id, item.serviceId)) {
        const service = services.find(s => s.id === item.serviceId);
        alert(`Measurement not found for ${service?.category || 'garment'}. Please capture measurements first.`);
        return;
      }
    }

    const orderItems = formData.items.map(item => {
      const s = services.find(service => service.id === item.serviceId)!;
      return {
        serviceId: s.id,
        serviceName: s.name,
        quantity: item.quantity,
        price: s.basePrice
      };
    });

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName: customer.name,
      items: orderItems,
      totalAmount: totalAmount,
      advancePaid: Number(formData.advance),
      status: OrderStatus.PENDING,
      deliveryDate: formData.deliveryDate,
      assignedTailorId: tailor?.id,
      assignedTailorName: tailor?.name,
      createdAt: new Date().toISOString(),
      taxAmount: taxAmount 
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    setFormData({ customerId: '', items: [{ serviceId: '', quantity: 1 }], advance: 0, deliveryDate: '', tailorId: '' });
  };

  const printMeasurementReference = (order: Order) => {
    const customer = customers.find(c => c.id === order.customerId);
    const relatedMeasurements = measurements.filter(m => 
      m.customerId === order.customerId && 
      order.items.some(oi => {
        const s = services.find(serv => serv.id === oi.serviceId);
        return s?.category.toLowerCase() === m.type.toLowerCase();
      })
    );

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Tailor Reference - ${order.orderNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .order-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .measurement-card { border: 1px solid #ccc; padding: 15px; border-radius: 8px; margin-bottom: 20px; page-break-inside: avoid; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 10px; }
            h2 { margin-top: 0; text-transform: uppercase; font-size: 1.2rem; }
            .label { font-weight: bold; color: #666; font-size: 0.8rem; text-transform: uppercase; }
            .value { font-weight: bold; font-size: 1.1rem; }
            .remarks { margin-top: 15px; font-style: italic; background: #f9f9f9; padding: 10px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${shopSettings.shopName} - JOB CARD</h1>
            <div class="order-info">
              <div>
                <p><strong>ORDER:</strong> ${order.orderNumber}</p>
                <p><strong>CUSTOMER:</strong> ${order.customerName}</p>
              </div>
              <div style="text-align: right">
                <p><strong>DUE DATE:</strong> ${order.deliveryDate}</p>
                <p><strong>TAILOR:</strong> ${order.assignedTailorName || 'Not Assigned'}</p>
              </div>
            </div>
          </div>
          
          ${relatedMeasurements.map(m => `
            <div class="measurement-card">
              <h2>${m.type} MEASUREMENTS</h2>
              <div class="grid">
                ${Object.entries(m.details).map(([k, v]) => `
                  <div>
                    <span class="label">${k}:</span>
                    <span class="value">${v}″</span>
                  </div>
                `).join('')}
              </div>
              ${m.remarks ? `<div class="remarks"><strong>Notes:</strong> ${m.remarks}</div>` : ''}
            </div>
          `).join('')}

          <div style="margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 20px;">
            <p><strong>INSTRUCTIONS:</strong> Verify all fabric before cutting. Cross-check against master patterns.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const handleOpenQuickMeasure = (index: number) => {
    if (!formData.customerId) {
      alert("Select a customer first.");
      return;
    }
    setActiveMeasureItemIndex(index);
    setIsQuickMeasureOpen(true);
  };

  const handleQuickMeasureSave = (measureData: any) => {
    const newM: Measurement = {
      id: Date.now().toString(),
      customerId: formData.customerId,
      ...measureData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setMeasurements([newM, ...measurements]);
    setIsQuickMeasureOpen(false);
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-slate-500 font-medium">Efficiently track workshops and deliveries</p>
        </div>
        {currentUser?.role === UserRole.OWNER && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95 font-black text-sm uppercase tracking-wider"
          >
            <Plus className="w-5 h-5" />
            New Order
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['All', ...Object.values(OrderStatus)].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              ${filter === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}
            `}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
            <div className="p-6 border-b border-slate-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{order.orderNumber}</span>
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{order.customerName}</h3>
              <div className="flex flex-wrap gap-2 mt-4">
                {order.items.map((i, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-slate-200/50">
                    {i.quantity}x {i.serviceName}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4" /> Delivery Due</span>
                <span className="font-black text-slate-900 text-sm">{order.deliveryDate}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bill</p>
                  <p className="text-xl font-black text-slate-900">₹{order.totalAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Outstanding</p>
                  <p className="text-xl font-black text-rose-500">₹{order.totalAmount - order.advancePaid}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border-t border-slate-100">
              <div className="flex items-center gap-3">
                <select 
                  className="flex-1 text-xs font-black bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all appearance-none text-slate-700 uppercase tracking-widest"
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                >
                  {Object.values(OrderStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button 
                  onClick={() => printMeasurementReference(order)}
                  title="Print Reference for Tailor"
                  className="p-3 bg-indigo-50 text-indigo-600 border-2 border-indigo-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </div>
              {order.assignedTailorName && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Tailor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                      {order.assignedTailorName.charAt(0)}
                    </div>
                    <span className="text-xs font-black text-indigo-600">{order.assignedTailorName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">No Active Projects</h3>
          <p className="text-slate-400 font-medium">Wait for a new customer order to start production.</p>
        </div>
      )}

      {/* NEW ORDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-white/10 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                  <ShoppingCart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Booking Multi-Item Order</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Professional StitchFlow Protocol</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-400 transition-all shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
              {/* Customer Selection */}
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Client Selection Protocol</label>
                <select 
                  required
                  className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black appearance-none shadow-sm"
                  value={formData.customerId}
                  onChange={e => setFormData({...formData, customerId: e.target.value})}
                >
                  <option value="">Scan or Search Client Database...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Garment Configuration</label>
                  <button 
                    type="button" 
                    onClick={handleAddItem}
                    className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.items.map((item, index) => {
                    const hasMeasure = checkMeasurementExists(formData.customerId, item.serviceId);
                    const service = services.find(s => s.id === item.serviceId);
                    
                    return (
                      <div key={index} className="relative group">
                        <div className={`flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-[2rem] border-2 transition-all shadow-sm ${hasMeasure ? 'border-slate-100' : (item.serviceId ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100')}`}>
                          <div className="flex-1 w-full">
                            <select 
                              required
                              className="w-full bg-transparent border-none focus:ring-0 font-black text-slate-900 text-lg uppercase tracking-tight"
                              value={item.serviceId}
                              onChange={e => handleItemChange(index, 'serviceId', e.target.value)}
                            >
                              <option value="">Choose Service...</option>
                              {services.map(s => <option key={s.id} value={s.id}>{s.name} (₹{s.basePrice})</option>)}
                            </select>
                          </div>
                          
                          <div className="flex items-center gap-6 w-full md:w-auto">
                            {/* Measurement Status */}
                            {item.serviceId && (
                              <div className="flex-1 md:flex-none">
                                {hasMeasure ? (
                                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Measured</span>
                                  </div>
                                ) : (
                                  <button 
                                    type="button"
                                    onClick={() => handleOpenQuickMeasure(index)}
                                    className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
                                  >
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Missing Fit - Record?</span>
                                  </button>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200">
                              <button 
                                type="button"
                                onClick={() => handleItemChange(index, 'quantity', Math.max(1, item.quantity - 1))}
                                className="p-1 hover:bg-white text-slate-400 rounded-lg transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-black text-sm text-slate-900">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => handleItemChange(index, 'quantity', item.quantity + 1)}
                                className="p-1 hover:bg-white text-slate-400 rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button 
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="p-3 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Advance Deposit (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black text-xl shadow-sm"
                    value={formData.advance}
                    onChange={e => setFormData({...formData, advance: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Committed Delivery</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black shadow-sm"
                    value={formData.deliveryDate}
                    onChange={e => setFormData({...formData, deliveryDate: e.target.value})}
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Assign Master Craftsman</label>
                  <select 
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black appearance-none shadow-sm"
                    value={formData.tailorId}
                    onChange={e => setFormData({...formData, tailorId: e.target.value})}
                  >
                    <option value="">Workshop Pool Assignment...</option>
                    {users.filter(u => u.role === UserRole.TAILOR).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            <div className="p-10 bg-slate-900 border-t border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Subtotal</p>
                    <p className="text-xl font-black text-white">₹{baseAmount.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Tax ({shopSettings.taxRate}%)</p>
                    <p className="text-xl font-black text-indigo-400">₹{taxAmount.toLocaleString()}</p>
                 </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Gross Processing Value</p>
                  <p className="text-4xl font-black text-white">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Account Receivable</p>
                  <p className="text-4xl font-black text-rose-500">₹{(totalAmount - formData.advance).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 rounded-[1.5rem] border-2 border-slate-700 font-black text-slate-400 hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
                >
                  Abort Protocol
                </button>
                <button 
                  onClick={handleCreateOrder}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all uppercase tracking-widest text-xs active:scale-95 flex items-center justify-center gap-3"
                >
                  <FileText className="w-5 h-5" /> Generate Job Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK MEASURE POPUP */}
      {isQuickMeasureOpen && activeMeasureItemIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <QuickMeasureForm 
            customerId={formData.customerId}
            customerName={customers.find(c => c.id === formData.customerId)?.name || ''}
            type={services.find(s => s.id === formData.items[activeMeasureItemIndex].serviceId)?.category as any || 'Shirt'}
            onClose={() => setIsQuickMeasureOpen(false)}
            onSave={handleQuickMeasureSave}
          />
        </div>
      )}
    </div>
  );
};

// HELPER COMPONENT FOR QUICK MEASURE
const QuickMeasureForm = ({ customerId, customerName, type, onClose, onSave }: any) => {
  const fields = type === 'Shirt' ? MOCK_SHIRT_FIELDS : MOCK_PANT_FIELDS;
  const [details, setDetails] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState('');

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-8 duration-500">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Rapid Fit Capturing</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{customerName} / ${type}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {fields.map(f => (
            <div key={f}>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{f} (in)</label>
              <input 
                type="text" 
                placeholder="00.0"
                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-rose-500 transition-all font-black text-center"
                onChange={e => setDetails({...details, [f]: e.target.value})}
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Styling Notes</label>
          <textarea 
            className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-rose-500 transition-all h-24 resize-none font-medium text-sm"
            placeholder="Pocket styles, button choices, etc."
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl border-2 border-slate-100 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]"
          >
            Cancel Fit
          </button>
          <button 
            onClick={() => onSave({ type, details, remarks })}
            className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-200 uppercase text-[10px] tracking-[0.2em] active:scale-95"
          >
            Verify & Save Fit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
