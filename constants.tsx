
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Scissors, 
  ShoppingBag, 
  CreditCard, 
  Package, 
  TrendingDown, 
  UserCircle, 
  Settings,
  Ruler
} from 'lucide-react';

export const APP_THEME = {
  primary: 'indigo-600',
  secondary: 'slate-600',
  accent: 'emerald-500',
  danger: 'rose-500',
  warning: 'amber-500'
};

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['OWNER', 'TAILOR'] },
  { name: 'Customers', path: '/customers', icon: <Users className="w-5 h-5" />, roles: ['OWNER', 'TAILOR'] },
  { name: 'Measurements', path: '/measurements', icon: <Ruler className="w-5 h-5" />, roles: ['OWNER', 'TAILOR'] },
  { name: 'Orders', path: '/orders', icon: <ShoppingBag className="w-5 h-5" />, roles: ['OWNER', 'TAILOR'] },
  { name: 'Inventory', path: '/inventory', icon: <Package className="w-5 h-5" />, roles: ['OWNER'] },
  { name: 'Expenses', path: '/expenses', icon: <TrendingDown className="w-5 h-5" />, roles: ['OWNER'] },
  { name: 'Services', path: '/services', icon: <Scissors className="w-5 h-5" />, roles: ['OWNER'] },
  { name: 'Payments', path: '/payments', icon: <CreditCard className="w-5 h-5" />, roles: ['OWNER'] },
  { name: 'Staff', path: '/staff', icon: <UserCircle className="w-5 h-5" />, roles: ['OWNER'] },
  { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" />, roles: ['OWNER'] },
];

export const MOCK_SHIRT_FIELDS = ['Collar', 'Chest', 'Waist', 'Sleeve Length', 'Shoulder', 'Full Length'];
export const MOCK_PANT_FIELDS = ['Waist', 'Hip', 'Thigh', 'Length', 'Bottom', 'Inseam'];
