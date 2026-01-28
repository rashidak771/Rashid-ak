
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI } from "@google/genai";
import { Ruler, Plus, Search, Scissors, Trash2, Sparkles, Loader2, X } from 'lucide-react';
import { Measurement } from '../types';
import { MOCK_SHIRT_FIELDS, MOCK_PANT_FIELDS } from '../constants';

const Measurements: React.FC = () => {
  const { measurements, setMeasurements, customers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Shirt' | 'Pant'>('Shirt');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
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

  const generateStylingTips = async () => {
    if (Object.keys(formData.details).length < 2) {
      alert("Please enter some measurements first for better suggestions!");
      return;
    }
    
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Client Measurements for a ${formData.type}:
        ${Object.entries(formData.details).map(([k, v]) => `- ${k}: ${v} inches`).join('\n')}
        
        Provide professional tailoring styling advice and design remarks (max 30 words). Suggest fit, collar/cuff style, or pocket styles suitable for these proportions.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a master tailor at a high-end bespoke boutique. Provide stylistic advice based on body measurements.",
        },
      });
      
      const advice = response.text || "Suggestion: Classic tailored fit with standard detailing.";
      setFormData(prev => ({
        ...prev,
        remarks: prev.remarks ? `${prev.remarks}\n\nAI Tip: ${advice}` : `AI Tip: ${advice}`
      }));
    } catch (e) {
      console.error(e);
      alert("AI Assistant is currently unavailable.");
    } finally {
      setIsAiLoading(false);
    }
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
    const term = searchTerm.toLowerCase().trim();
    return (cust?.name || '').toLowerCase().includes(term) || (cust?.phone || '').includes(term);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Measurements</h1>
          <p className="text-slate-500 font-medium">Precision fitting database for every client.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 active:scale-95 font-bold"
        >
          <Plus className="w-5 h-5" />
          Add Record
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="pl-12 pr-4 py-3 w-full rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {filteredMeasurements.map((m) => {
            const customer = customers.find(c => c.id === m.customerId);
            return (
              <div key={m.id} className="bg-white rounded-2xl p-6 border-2 border-slate-50 hover:border-indigo-100 transition-all relative group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${m.type === 'Shirt' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {m.type}
                  </div>
                  <span className="text-xs font-bold text-slate-400">{m.updatedAt}</span>
                </div>
                <h3 className="font-black text-slate-900 text-xl leading-tight">{customer?.name || 'Unknown'}</h3>
                <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">{customer?.phone}</p>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-6">
                  {Object.entries(m.details).map(([key, val]) => (
                    <div key={key} className="flex flex-col border-l-2 border-slate-100 pl-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{key}</span>
                      <span className="font-black text-slate-800 text-sm">{val}″</span>
                    </div>
                  ))}
                </div>

                {m.remarks && (
                  <div className="text-xs text-slate-600 font-medium p-3 bg-slate-50 rounded-xl border border-slate-100 italic line-clamp-2">
                    {m.remarks}
                  </div>
                )}

                <button 
                  onClick={() => setMeasurements(measurements.filter(item => item.id !== m.id))}
                  className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {filteredMeasurements.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ruler className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No Records Found</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Start by recording a new measurement for a client.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-white/10">
            <div className="p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Record Fitting</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-900 shadow-sm transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-8 max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Target Customer *</label>
                  <select 
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-bold"
                    value={formData.customerId}
                    onChange={e => setFormData({...formData, customerId: e.target.value})}
                  >
                    <option value="">Choose a client...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Garment Category</label>
                  <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => { setFormData({...formData, type: 'Shirt', details: {}}); setActiveTab('Shirt'); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Shirt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Shirt
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setFormData({...formData, type: 'Pant', details: {}}); setActiveTab('Pant'); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Pant' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Pant
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[64px]"></div>
                <div className="relative flex items-center justify-between mb-8">
                  <h3 className="font-black text-white text-lg flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-indigo-400" /> 
                    Input Dimensions (inches)
                  </h3>
                  <button 
                    type="button"
                    onClick={generateStylingTips}
                    disabled={isAiLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    AI Stylist Advice
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {(activeTab === 'Shirt' ? MOCK_SHIRT_FIELDS : MOCK_PANT_FIELDS).map(field => (
                    <div key={field}>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{field}</label>
                      <input 
                        type="text" 
                        placeholder="00.0"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-800 bg-slate-800 text-white focus:bg-slate-700 focus:border-indigo-500 transition-all font-black text-center placeholder:text-slate-600"
                        onChange={(e) => handleAddField(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Design Remarks & AI Styling</label>
                <textarea 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all h-32 resize-none font-medium text-sm placeholder:text-slate-300"
                  placeholder="Special instructions or AI generated styling tips will appear here..."
                  value={formData.remarks}
                  onChange={e => setFormData({...formData, remarks: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 rounded-2xl border-2 border-slate-100 font-black text-slate-400 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Save Fitting Data
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
