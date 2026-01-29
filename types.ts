
export enum UserRole {
  OWNER = 'OWNER',
  TAILOR = 'TAILOR'
}

export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  STITCHING = 'Stitching',
  READY = 'Ready',
  DELIVERED = 'Delivered'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  salary?: number;
  lastSalaryPaid?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface Measurement {
  id: string;
  customerId: string;
  type: 'Shirt' | 'Pant' | 'Custom';
  details: Record<string, string | number>;
  remarks?: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: {
    serviceId: string;
    serviceName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  advancePaid: number;
  status: OrderStatus;
  deliveryDate: string;
  assignedTailorId?: string;
  assignedTailorName?: string;
  createdAt: string;
  taxAmount: number;
}

export interface Service {
  id: string;
  name: string;
  basePrice: number;
  category: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Fabric' | 'Accessory' | 'Thread' | 'Other';
  stock: number;
  unit: string;
  lowStockThreshold: number;
}

export interface ShopSettings {
  taxRate: number;
  shopName: string;
  address: string;
  currency: string;
}
