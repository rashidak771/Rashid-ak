
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Plus, Trash2, Edit } from 'lucide-react';
import { Service } from '../types';

const Services: React.FC = () => {
  const { services, setServices } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', basePrice: 0, category: 'Shirt' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const s: Service = { id: Date.now().toString(), ...newService };
    setServices([...services, s]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-500">Manage stitching types and pricing</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Scissors className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.category}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{s.name}</h3>
            <p className="text-2xl font-black text-indigo-600 mt-2">₹{s.basePrice}</p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
              <button className="flex-1 py-2 text-sm font-bold border rounded-lg hover:bg-slate-50">Edit</button>
              <button onClick={() => setServices(services.filter(item => item.id !== s.id))} className="p-2 border rounded-lg text-rose-500 hover:bg-rose-50">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">New Service</h2>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700">Service Name</label>
                <input required className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-slate-700">Category</label>
                  <select className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}>
                    <option>Shirt</option>
                    <option>Pant</option>
                    <option>Suit</option>
                    <option>Dress</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-slate-700">Base Price (₹)</label>
                  <input type="number" required className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" value={newService.basePrice} onChange={e => setNewService({...newService, basePrice: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold">Create Service</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
