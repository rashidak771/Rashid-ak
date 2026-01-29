
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
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import Services from './pages/Services';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Reports from './pages/Reports';

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/customers" element={<Layout><Customers /></Layout>} />
      <Route path="/orders" element={<Layout><Orders /></Layout>} />
      <Route path="/measurements" element={<Layout><Measurements /></Layout>} />
      <Route path="/staff" element={<Layout><Staff /></Layout>} />
      <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
      <Route path="/expenses" element={<Layout><Expenses /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/payments" element={<Layout><Payments /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
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
