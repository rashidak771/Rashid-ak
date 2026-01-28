
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Measurements from './pages/Measurements';
import Staff from './pages/Staff';
import Login from './pages/Login';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};

// Placeholder components for other modules to keep code within limit
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
    <h2 className="text-2xl font-bold mb-2">{name}</h2>
    <p>This module is currently being configured.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/customers" element={<Layout><Customers /></Layout>} />
      <Route path="/orders" element={<Layout><Orders /></Layout>} />
      <Route path="/measurements" element={<Layout><Measurements /></Layout>} />
      <Route path="/staff" element={<Layout><Staff /></Layout>} />
      <Route path="/inventory" element={<Layout><Placeholder name="Inventory Management" /></Layout>} />
      <Route path="/expenses" element={<Layout><Placeholder name="Expense Tracker" /></Layout>} />
      <Route path="/services" element={<Layout><Placeholder name="Service Catalog" /></Layout>} />
      <Route path="/payments" element={<Layout><Placeholder name="Payments & Invoicing" /></Layout>} />
      <Route path="/settings" element={<Layout><Placeholder name="System Settings" /></Layout>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
