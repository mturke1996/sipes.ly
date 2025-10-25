import { ChartData } from "../types/database";
import { ordersService, productsService } from "./databaseService";

export class ChartService {
  // Generate revenue chart data
  async getRevenueChartData(
    period: "week" | "month" | "year" = "month"
  ): Promise<ChartData> {
    const orders = await ordersService.getAll();
    const now = new Date();

    let labels: string[] = [];
    let data: number[] = [];

    if (period === "week") {
      // Last 7 days
      labels = [];
      data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString("ar-LY", { weekday: "short" });
        labels.push(dayName);

        const dayOrders = orders.filter((order) => {
          const orderDate = order.createdAt;
          return (
            orderDate.getDate() === date.getDate() &&
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        });

        const dayRevenue = dayOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        data.push(dayRevenue);
      }
    } else if (period === "month") {
      // Last 12 months
      labels = [];
      data = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString("ar-LY", { month: "short" });
        labels.push(monthName);

        const monthOrders = orders.filter((order) => {
          const orderDate = order.createdAt;
          return (
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        });

        const monthRevenue = monthOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        data.push(monthRevenue);
      }
    } else if (period === "year") {
      // Last 5 years
      labels = [];
      data = [];
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        labels.push(year.toString());

        const yearOrders = orders.filter((order) => {
          const orderDate = order.createdAt;
          return orderDate.getFullYear() === year;
        });

        const yearRevenue = yearOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        data.push(yearRevenue);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "الإيرادات (د.ل)",
          data,
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)", // Red
            "rgba(34, 197, 94, 0.8)", // Green
            "rgba(59, 130, 246, 0.8)", // Blue
            "rgba(168, 85, 247, 0.8)", // Purple
            "rgba(245, 158, 11, 0.8)", // Yellow
            "rgba(236, 72, 153, 0.8)", // Pink
            "rgba(14, 165, 233, 0.8)", // Sky
          ],
          borderColor: "rgba(239, 68, 68, 1)",
        },
      ],
    };
  }

  // Generate orders chart data
  async getOrdersChartData(
    period: "week" | "month" | "year" = "month"
  ): Promise<ChartData> {
    const orders = await ordersService.getAll();
    const now = new Date();

    let labels: string[] = [];
    let data: number[] = [];

    if (period === "week") {
      // Last 7 days
      labels = [];
      data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString("ar-LY", { weekday: "short" });
        labels.push(dayName);

        const dayOrders = orders.filter((order) => {
          const orderDate = order.createdAt;
          return (
            orderDate.getDate() === date.getDate() &&
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        });

        data.push(dayOrders.length);
      }
    } else if (period === "month") {
      // Last 12 months
      labels = [];
      data = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString("ar-LY", { month: "short" });
        labels.push(monthName);

        const monthOrders = orders.filter((order) => {
          const orderDate = order.createdAt;
          return (
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        });

        data.push(monthOrders.length);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "عدد الطلبات",
          data,
          backgroundColor: ["rgba(34, 197, 94, 0.8)"],
          borderColor: "rgba(34, 197, 94, 1)",
        },
      ],
    };
  }

  // Generate product categories chart
  async getCategoriesChartData(): Promise<ChartData> {
    const products = await productsService.getAll();
    const categoryCount: { [key: string]: number } = {};

    products.forEach((product) => {
      const category = product.category || "غير محدد";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const labels = Object.keys(categoryCount);
    const data = Object.values(categoryCount);

    return {
      labels,
      datasets: [
        {
          label: "عدد المنتجات",
          data,
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(14, 165, 233, 0.8)",
          ],
        },
      ],
    };
  }

  // Generate order status chart
  async getOrderStatusChartData(): Promise<ChartData> {
    const orders = await ordersService.getAll();
    const statusCount: { [key: string]: number } = {};

    orders.forEach((order) => {
      const status = order.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const statusLabels = {
      pending: "في الانتظار",
      confirmed: "مؤكد",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    };

    const labels = Object.keys(statusCount).map(
      (status) => statusLabels[status as keyof typeof statusLabels] || status
    );
    const data = Object.values(statusCount);

    return {
      labels,
      datasets: [
        {
          label: "عدد الطلبات",
          data,
          backgroundColor: [
            "rgba(245, 158, 11, 0.8)", // Yellow for pending
            "rgba(34, 197, 94, 0.8)", // Green for confirmed
            "rgba(59, 130, 246, 0.8)", // Blue for processing
            "rgba(168, 85, 247, 0.8)", // Purple for shipped
            "rgba(14, 165, 233, 0.8)", // Sky for delivered
            "rgba(239, 68, 68, 0.8)", // Red for cancelled
          ],
        },
      ],
    };
  }

  // Generate top products chart
  async getTopProductsChartData(limit: number = 10): Promise<ChartData> {
    const orders = await ordersService.getAll();
    const productSales: { [key: string]: { name: string; sales: number } } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId;
        const productName =
          item.product?.nameAr || item.product?.name || "منتج غير محدد";

        if (!productSales[productId]) {
          productSales[productId] = { name: productName, sales: 0 };
        }
        productSales[productId].sales += item.quantity;
      });
    });

    // Sort by sales and get top products
    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit);

    const labels = sortedProducts.map((product) => product.name);
    const data = sortedProducts.map((product) => product.sales);

    return {
      labels,
      datasets: [
        {
          label: "كمية المبيعات",
          data,
          backgroundColor: ["rgba(59, 130, 246, 0.8)"],
          borderColor: "rgba(59, 130, 246, 1)",
        },
      ],
    };
  }
}

// Export singleton instance
export const chartService = new ChartService();
