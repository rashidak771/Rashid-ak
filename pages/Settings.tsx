
import React from 'react';
import { Settings as SettingsIcon, Store, Shield, Bell, Download } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500">Configure your shop profile and workflow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" /> Shop Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Shop Name</label>
                <input type="text" className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" defaultValue="StitchFlow Pro" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Currency Symbol</label>
                <input type="text" className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" defaultValue="₹" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Shop Address</label>
                <textarea className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900 h-24" defaultValue="123 Fashion Street, New Delhi, India" />
              </div>
            </div>
            <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
              Save Profile
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" /> Tax Configuration
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">GST / VAT Percentage (%)</label>
                <input type="number" className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" defaultValue="5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Tax ID / GSTIN</label>
                <input type="text" className="w-full p-2 border rounded-lg bg-slate-50 text-slate-900" placeholder="07AAAAA0000A1Z5" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" /> Data Backup
            </h3>
            <p className="text-sm text-slate-500 mb-4">Download all your customer and order data as a JSON file for local backup.</p>
            <button className="w-full py-2 border-2 border-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Export Database
            </button>
          </div>

          <div className="bg-indigo-900 p-6 rounded-xl shadow-sm text-white">
            <h3 className="text-lg font-bold mb-2">Need Support?</h3>
            <p className="text-indigo-200 text-sm mb-4">Contact our technical team for custom features or cloud synchronization.</p>
            <button className="w-full py-2 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-500 transition-colors">
              Chat with Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
