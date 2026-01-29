
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI } from "@google/genai";
import { Ruler, Plus, Search, Scissors, Trash2, Sparkles, Loader2, X, ChevronRight } from 'lucide-react';
import { Measurement, Customer } from '../types';
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

  // Group measurements by customer for consolidated card view
  const groupedMeasurements = useMemo(() => {
    return customers.map(customer => {
      const customerMeasures = measurements.filter(m => m.customerId === customer.id);
      if (customerMeasures.length === 0) return null;

      // Get latest of each type
      const shirt = customerMeasures.filter(m => m.type === 'Shirt').sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      const pant = customerMeasures.filter(m => m.type === 'Pant').sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      
      const latestUpdate = customerMeasures.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].updatedAt;

      return {
        customer,
        shirt,
        pant,
        latestUpdate
      };
    }).filter(Boolean);
  }, [measurements, customers]);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return groupedMeasurements;
    return groupedMeasurements.filter(g => 
      g?.customer.name.toLowerCase().includes(term) || 
      g?.customer.phone.includes(term)
    );
  }, [groupedMeasurements, searchTerm]);

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

  const handleDeleteRecord = (id: string) => {
    if(confirm("Delete this specific measurement record?")) {
      setMeasurements(measurements.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Consolidated Fittings</h1>
          <p className="text-slate-500 font-medium tracking-tight">Unified customer measurement records</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95 font-black uppercase text-xs tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Add Fitting
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by client name or mobile..." 
              className="pl-12 pr-4 py-3.5 w-full rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-8 space-y-8">
          {filteredGroups.map((group) => (
            <div key={group?.customer.id} className="bg-white rounded-[2rem] border-2 border-slate-100 overflow-hidden hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">
              {/* Card Header */}
              <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100">
                    {group?.customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-2xl tracking-tight">{group?.customer.name}</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{group?.customer.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Last Profile Update</p>
                  <p className="text-sm font-black text-indigo-600">{group?.latestUpdate}</p>
                </div>
              </div>

              {/* Card Content - Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                {/* SHIRT COLUMN */}
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Scissors className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Shirt Configuration</h4>
                    </div>
                    {group?.shirt && (
                      <button 
                        onClick={() => handleDeleteRecord(group.shirt.id)}
                        className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {group?.shirt ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {Object.entries(group.shirt.details).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{key}</p>
                          <p className="text-lg font-black text-slate-800">{val}″</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                      <Ruler className="w-8 h-8 text-slate-200 mb-2" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Shirt Data</p>
                    </div>
                  )}
                  
                  {group?.shirt?.remarks && (
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Designer Remarks
                      </p>
                      <p className="text-xs text-indigo-900 font-medium italic leading-relaxed">{group.shirt.remarks}</p>
                    </div>
                  )}
                </div>

                {/* PANT COLUMN */}
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Scissors className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Pant Configuration</h4>
                    </div>
                    {group?.pant && (
                      <button 
                        onClick={() => handleDeleteRecord(group.pant.id)}
                        className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {group?.pant ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {Object.entries(group.pant.details).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{key}</p>
                          <p className="text-lg font-black text-slate-800">{val}″</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                      <Ruler className="w-8 h-8 text-slate-200 mb-2" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Pant Data</p>
                    </div>
                  )}

                  {group?.pant?.remarks && (
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Designer Remarks
                      </p>
                      <p className="text-xs text-emerald-900 font-medium italic leading-relaxed">{group.pant.remarks}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Ruler className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Archives Empty</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">No fitting profiles matched your search or haven't been created yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL - Add fitting */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-white/10">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Record Fitting</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-900 shadow-sm transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-10 max-h-[80vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Target Customer *</label>
                  <select 
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black appearance-none"
                    value={formData.customerId}
                    onChange={e => setFormData({...formData, customerId: e.target.value})}
                  >
                    <option value="">Select Client...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Garment Line</label>
                  <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => { setFormData({...formData, type: 'Shirt', details: {}}); setActiveTab('Shirt'); }}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${activeTab === 'Shirt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Shirt Fit
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setFormData({...formData, type: 'Pant', details: {}}); setActiveTab('Pant'); }}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${activeTab === 'Pant' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Pant Fit
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px]"></div>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                  <h3 className="font-black text-white text-xl flex items-center gap-4">
                    <Ruler className="w-6 h-6 text-indigo-400" /> 
                    Input Dimensions (in)
                  </h3>
                  <button 
                    type="button"
                    onClick={generateStylingTips}
                    disabled={isAiLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-xl flex items-center gap-3 shadow-2xl shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Styling Logic
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                  {(activeTab === 'Shirt' ? MOCK_SHIRT_FIELDS : MOCK_PANT_FIELDS).map(field => (
                    <div key={field}>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{field}</label>
                      <input 
                        type="text" 
                        placeholder="0.0"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-800 bg-slate-800 text-white focus:bg-slate-700 focus:border-indigo-500 transition-all font-black text-center placeholder:text-slate-700 text-lg shadow-inner"
                        onChange={(e) => handleAddField(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Tailor Instructions & AI Advice</label>
                <textarea 
                  className="w-full px-6 py-5 rounded-[2rem] border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all h-40 resize-none font-medium text-sm placeholder:text-slate-300 shadow-sm"
                  placeholder="Additional styling requirements or AI suggestions..."
                  value={formData.remarks}
                  onChange={e => setFormData({...formData, remarks: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 rounded-2xl border-2 border-slate-100 font-black text-slate-400 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Verify & Store
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
