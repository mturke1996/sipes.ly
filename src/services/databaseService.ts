import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Product,
  Category,
  Customer,
  Order,
  Admin,
  DashboardStats,
  Review,
  ContactMessage,
} from "../types/database";

// Products Service
export const productsService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  },

  // Get product by ID
  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Product;
    }
    return null;
  },

  // Add new product
  async create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
      console.log("Product created successfully with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("فشل في إنشاء المنتج");
    }
  },

  // Update product
  async update(id: string, product: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...product,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      console.log("Product updated successfully:", id);
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("فشل في تحديث المنتج");
    }
  },

  // Delete product
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "products", id));
      console.log("Product deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("فشل في حذف المنتج");
    }
  },

  // Get products by category
  async getByCategory(categoryId: string): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("categoryId", "==", categoryId),
      where("isActive", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  },

  // Get low stock products
  async getLowStock(threshold: number = 10): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("stock", "<=", threshold),
      where("isActive", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  },
};

// Categories Service
export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  },

  async create(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
  },

  async update(id: string, category: Partial<Category>): Promise<void> {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, {
      ...category,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "categories", id));
  },
};

// Customers Service
export const customersService = {
  async getAll(): Promise<Customer[]> {
    const snapshot = await getDocs(collection(db, "customers"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Customer[];
  },

  async create(
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, "customers"), {
      ...customer,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
  },

  async update(id: string, customer: Partial<Customer>): Promise<void> {
    const docRef = doc(db, "customers", id);
    await updateDoc(docRef, {
      ...customer,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "customers", id));
  },
};

// Orders Service
export const ordersService = {
  async getAll(): Promise<Order[]> {
    const snapshot = await getDocs(collection(db, "orders"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
  },

  async getById(id: string): Promise<Order | null> {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Order;
    }
    return null;
  },

  async create(
    order: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
  },

  async update(id: string, order: Partial<Order>): Promise<void> {
    const docRef = doc(db, "orders", id);
    await updateDoc(docRef, {
      ...order,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async getByStatus(status: string): Promise<Order[]> {
    const q = query(collection(db, "orders"), where("status", "==", status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
  },
};

// Dashboard Stats Service
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [productsSnapshot, ordersSnapshot, customersSnapshot] =
      await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "customers")),
      ]);

    const products = productsSnapshot.docs.map((doc) => doc.data());
    const orders = ordersSnapshot.docs.map((doc) => doc.data());
    const customers = customersSnapshot.docs.map((doc) => doc.data());

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const lowStockProducts = products.filter(
      (product) => (product.stock || 0) <= 10
    ).length;

    // Calculate monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyOrders = orders.filter((order) => {
      const orderDate = order.createdAt?.toDate() || new Date();
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });
    const monthlyRevenue = monthlyOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    // Calculate weekly orders
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyOrders = orders.filter((order) => {
      const orderDate = order.createdAt?.toDate() || new Date();
      return orderDate >= oneWeekAgo;
    }).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      monthlyRevenue,
      weeklyOrders,
    };
  },
};

// Reviews Service
export const reviewsService = {
  async getAll(): Promise<Review[]> {
    const snapshot = await getDocs(collection(db, "reviews"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      repliedAt: doc.data().repliedAt?.toDate(),
    })) as Review[];
  },

  async getActive(): Promise<Review[]> {
    const q = query(
      collection(db, "reviews"),
      where("isActive", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      repliedAt: doc.data().repliedAt?.toDate(),
    })) as Review[];
  },

  async create(
    review: Omit<Review, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, "reviews"), {
      ...review,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
  },

  async update(id: string, review: Partial<Review>): Promise<void> {
    const docRef = doc(db, "reviews", id);
    await updateDoc(docRef, {
      ...review,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "reviews", id));
  },

  async addReply(id: string, reply: string): Promise<void> {
    const docRef = doc(db, "reviews", id);
    await updateDoc(docRef, {
      reply,
      repliedAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },
};

// Contact Messages Service
export const contactMessagesService = {
  async getAll(): Promise<ContactMessage[]> {
    const snapshot = await getDocs(
      query(collection(db, "contactMessages"), orderBy("createdAt", "desc"))
    );
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      repliedAt: doc.data().repliedAt?.toDate(),
    })) as ContactMessage[];
  },

  async getByStatus(status: string): Promise<ContactMessage[]> {
    const q = query(
      collection(db, "contactMessages"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      repliedAt: doc.data().repliedAt?.toDate(),
    })) as ContactMessage[];
  },

  async create(
    message: Omit<ContactMessage, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, "contactMessages"), {
      ...message,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
  },

  async update(id: string, message: Partial<ContactMessage>): Promise<void> {
    const docRef = doc(db, "contactMessages", id);
    await updateDoc(docRef, {
      ...message,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "contactMessages", id));
  },

  async addReply(id: string, reply: string): Promise<void> {
    const docRef = doc(db, "contactMessages", id);
    await updateDoc(docRef, {
      reply,
      status: "replied",
      repliedAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },
};
