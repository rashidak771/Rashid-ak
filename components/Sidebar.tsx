
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Scissors } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NAVIGATION_ITEMS } from '../constants';

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(currentUser?.role || '')
  );

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Scissors className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">StitchFlow</h1>
          <p className="text-xs text-slate-400">Pro Management</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {filteredNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-400">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{currentUser?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
