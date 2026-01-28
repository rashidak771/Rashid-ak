
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ruler, Plus, Search, Scissors, Trash2 } from 'lucide-react';
import { Measurement } from '../types';
import { MOCK_SHIRT_FIELDS, MOCK_PANT_FIELDS } from '../constants';

const Measurements: React.FC = () => {
  const { measurements, setMeasurements, customers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Shirt' | 'Pant'>('Shirt');
  
  const [formData, setFormData] = useState({
    customerId: '',
    type: 'Shirt' as 'Shirt' | 'Pant',
    details: {} as Record<string, string>,
    remarks: ''
  });

  const handleAddField = (field: string, val: string) => {
    setFormData({
      ...formData,
      details: { ...formData.details, [field]: val }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) return;

    const newM: Measurement = {
      id: Date.now().toString(),
      customerId: formData.customerId,
      type: formData.type as any,
      details: formData.details,
      remarks: formData.remarks,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setMeasurements([newM, ...measurements]);
    setIsModalOpen(false);
    setFormData({ customerId: '', type: 'Shirt', details: {}, remarks: '' });
  };

  const filteredMeasurements = measurements.filter(m => {
    const cust = customers.find(c => c.id === m.customerId);
    return cust?.name.toLowerCase().includes(searchTerm.toLowerCase()) || cust?.phone.includes(searchTerm);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Measurements</h1>
          <p className="text-slate-500">Record and retrieve client fitting details</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Measurement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by customer name..." 
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredMeasurements.map((m) => {
            const customer = customers.find(c => c.id === m.customerId);
            return (
              <div key={m.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${m.type === 'Shirt' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {m.type}
                  </div>
                  <span className="text-xs text-slate-400">{m.updatedAt}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{customer?.name || 'Unknown'}</h3>
                <p className="text-xs text-slate-500 mb-4">{customer?.phone}</p>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                  {Object.entries(m.details).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm border-b border-slate-200 pb-1">
                      <span className="text-slate-500">{key}:</span>
                      <span className="font-bold text-slate-700">{val}″</span>
                    </div>
                  ))}
                </div>

                {m.remarks && (
                  <div className="text-xs text-slate-400 italic mt-2">
                    "{m.remarks}"
                  </div>
                )}

                <button 
                  onClick={() => setMeasurements(measurements.filter(item => item.id !== m.id))}
                  className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-rose-100 text-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {filteredMeasurements.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400">
              <Ruler className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No measurement records found.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">New Measurement</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer *</label>
                  <select 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                    value={formData.customerId}
                    onChange={e => setFormData({...formData, customerId: e.target.value})}
                  >
                    <option value="">Search customer...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Garment Type *</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => { setFormData({...formData, type: 'Shirt', details: {}}); setActiveTab('Shirt'); }}
                      className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${activeTab === 'Shirt' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      Shirt
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setFormData({...formData, type: 'Pant', details: {}}); setActiveTab('Pant'); }}
                      className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${activeTab === 'Pant' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      Pant
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Scissors className="w-4 h-4" /> Size Details (inches)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(activeTab === 'Shirt' ? MOCK_SHIRT_FIELDS : MOCK_PANT_FIELDS).map(field => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field}</label>
                      <input 
                        type="text" 
                        placeholder="0.0"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => handleAddField(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Special Design Remarks</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 h-20"
                  placeholder="E.g. Double pocket, slim fit, specific cuff style..."
                  value={formData.remarks}
                  onChange={e => setFormData({...formData, remarks: e.target.value})}
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
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Measurements;
