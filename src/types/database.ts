// Database Types for SIPES Libya
export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  category: string;
  categoryId: string;
  images: string[];
  stock: number;
  isActive: boolean;
  specifications: {
    color?: string;
    coverage?: string;
    dryingTime?: string;
    application?: string;
    finish?: string;
  };
  features?: {
    easyToApply?: boolean;
    highQuality?: boolean;
    tenYearWarranty?: boolean;
    weatherResistant?: boolean;
    waterproof?: boolean;
    ecoFriendly?: boolean;
    fastDrying?: boolean;
    new?: boolean;
  };
  customFeatures?: string; // For custom features text
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  telegramId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cash" | "bank_transfer" | "online";
  shippingAddress: string;
  notes?: string;
  telegramNotificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  isActive: boolean;
  telegramId?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface TelegramSettings {
  botToken: string;
  chatId: string;
  isEnabled: boolean;
  notifications: {
    newOrder: boolean;
    orderUpdate: boolean;
    lowStock: boolean;
    dailyReport: boolean;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  monthlyRevenue: number;
  weeklyOrders: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

// ImgBB API Types
export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  location?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  verified: boolean;
  isActive: boolean;
  productId?: string;
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  reply?: string;
  repliedAt?: Date;
  telegramSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}