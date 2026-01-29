
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Customer, Order, Measurement, Service, InventoryItem, Expense, OrderStatus, ShopSettings } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  shopSettings: ShopSettings;
  setShopSettings: React.Dispatch<React.SetStateAction<ShopSettings>>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('stitchflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('stitchflow_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('stitchflow_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [measurements, setMeasurements] = useState<Measurement[]>(() => {
    const saved = localStorage.getItem('stitchflow_measurements');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('stitchflow_services');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Standard Shirt Stitching', basePrice: 450, category: 'Shirt' },
      { id: '2', name: 'Premium Pant Stitching', basePrice: 550, category: 'Pant' },
      { id: '3', name: 'Suit Set (2pc)', basePrice: 2500, category: 'Suit' }
    ];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('stitchflow_inventory');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'White Cotton Thread', category: 'Thread', stock: 50, unit: 'Rolls', lowStockThreshold: 10 },
      { id: '2', name: 'Premium Suit Buttons', category: 'Accessory', stock: 200, unit: 'Pcs', lowStockThreshold: 50 }
    ];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('stitchflow_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('stitchflow_staff');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Admin Owner', role: UserRole.OWNER, username: 'admin' },
      { id: '2', name: 'John Tailor', role: UserRole.TAILOR, username: 'john', salary: 15000 }
    ];
  });

  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('stitchflow_settings');
    return saved ? JSON.parse(saved) : {
      taxRate: 5,
      shopName: 'StitchFlow Pro',
      address: '123 Fashion Street, New Delhi',
      currency: '₹'
    };
  });

  useEffect(() => {
    localStorage.setItem('stitchflow_user', JSON.stringify(currentUser));
    localStorage.setItem('stitchflow_customers', JSON.stringify(customers));
    localStorage.setItem('stitchflow_orders', JSON.stringify(orders));
    localStorage.setItem('stitchflow_measurements', JSON.stringify(measurements));
    localStorage.setItem('stitchflow_services', JSON.stringify(services));
    localStorage.setItem('stitchflow_inventory', JSON.stringify(inventory));
    localStorage.setItem('stitchflow_expenses', JSON.stringify(expenses));
    localStorage.setItem('stitchflow_staff', JSON.stringify(users));
    localStorage.setItem('stitchflow_settings', JSON.stringify(shopSettings));
  }, [currentUser, customers, orders, measurements, services, inventory, expenses, users, shopSettings]);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stitchflow_user');
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      customers, setCustomers,
      orders, setOrders,
      measurements, setMeasurements,
      services, setServices,
      inventory, setInventory,
      expenses, setExpenses,
      users, setUsers,
      shopSettings, setShopSettings,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
