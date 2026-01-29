
import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Store, Shield, Bell, Download, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const { shopSettings, setShopSettings } = useApp();

  const handleUpdate = (field: string, value: any) => {
    setShopSettings({ ...shopSettings, [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Controls</h1>
        <p className="text-slate-500 font-medium">Configure core business protocols and tax rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Store className="w-6 h-6 text-indigo-600" /> Shop Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Boutique Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black shadow-sm" 
                  value={shopSettings.shopName}
                  onChange={e => handleUpdate('shopName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Base Currency</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black shadow-sm text-center" 
                  value={shopSettings.currency}
                  onChange={e => handleUpdate('currency', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Operations Headquarters</label>
                <textarea 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all h-28 resize-none font-medium text-sm shadow-sm" 
                  value={shopSettings.address}
                  onChange={e => handleUpdate('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Shield className="w-6 h-6 text-indigo-600" /> Tax Protocol (GST/VAT)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Standard Tax Rate (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 transition-all font-black shadow-sm text-xl" 
                    value={shopSettings.taxRate}
                    onChange={e => handleUpdate('taxRate', Number(e.target.value))}
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                </div>
              </div>
              <div className="flex items-center">
                 <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-wider">
                      Tax is automatically added to all new orders. Existing orders remain unaffected by rate changes.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
              <Download className="w-6 h-6 text-indigo-400" /> Data Integrity
            </h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">Download snapshots of the entire shop database for manual archival or migration.</p>
            <button className="w-full py-4 bg-white/5 border-2 border-white/10 rounded-2xl font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]">
              Export Master DB
            </button>
          </div>

          <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 transition-transform group-hover:scale-110"></div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Enterprise Support</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-8">Access dedicated engineering support for custom workflow plugins or multi-branch sync.</p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-xl shadow-black/10 hover:bg-indigo-50 transition-all uppercase tracking-widest text-[10px]">
              Request Assistance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
