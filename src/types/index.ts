export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface PaintProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  type: string; // 'interior' | 'exterior' | 'special'
  color?: string;
  size?: string;
  quantity?: number;
  coverage?: string; // متر مربع لكل لتر
  specifications?: Record<string, string>;
  rating?: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
