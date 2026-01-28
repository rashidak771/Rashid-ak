
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Scissors, Lock, User as UserIcon } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Simplified: no real pwd check
  const { users, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      navigate('/');
    } else {
      alert("Invalid credentials. Try 'admin' or 'john'");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 mb-6 shadow-2xl shadow-indigo-500/20">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">STITCHFLOW<span className="text-indigo-500">PRO</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Professional Tailor Management System</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  required
                  type="password" 
                  className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
            >
              Sign Into Dashboard
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span>Demo Users:</span>
            <div className="flex gap-4">
              <span className="text-indigo-400">admin</span>
              <span className="text-indigo-400">john</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-600 text-sm">
          &copy; 2024 StitchFlow Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
