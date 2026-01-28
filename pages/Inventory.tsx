
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, Search, AlertTriangle, ArrowUpDown, Trash2 } from 'lucide-react';
import { InventoryItem } from '../types';

const Inventory: React.FC = () => {
  const { inventory, setInventory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Fabric', stock: 0, unit: 'Meters', lowStockThreshold: 5 });

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem as any
    };
    setInventory([...inventory, item]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500">Stock tracking for fabrics and accessories</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" /> Add Stock Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInventory.map((item) => {
              const isLow = item.stock <= item.lowStockThreshold;
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 text-slate-600">{item.stock} {item.unit}</td>
                  <td className="px-6 py-4">
                    {isLow ? (
                      <span className="flex items-center gap-1 text-rose-600 text-xs font-bold bg-rose-50 px-2 py-1 rounded-full w-fit">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full w-fit">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setInventory(inventory.filter(i => i.id !== item.id))}
                      className="text-slate-400 hover:text-rose-600 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredInventory.length === 0 && (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500">Inventory is empty.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">New Inventory Item</h2>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Item Name</label>
                <input required className="w-full p-2 border rounded-lg bg-slate-50" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select className="w-full p-2 border rounded-lg bg-slate-50" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                    <option>Fabric</option>
                    <option>Thread</option>
                    <option>Accessory</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Unit</label>
                  <input className="w-full p-2 border rounded-lg bg-slate-50" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Stock</label>
                  <input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Low Limit</label>
                  <input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={newItem.lowStockThreshold} onChange={e => setNewItem({...newItem, lowStockThreshold: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold">Add Item</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
