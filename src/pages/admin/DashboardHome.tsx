import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Star,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { dashboardService } from "../../services/databaseService";
import { telegramService } from "../../services/telegramService";
import { DashboardStats } from "../../types/database";

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlyRevenue: 0,
    weeklyOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [telegramConnected, setTelegramConnected] = useState(false);

  useEffect(() => {
    loadDashboardData();
    checkTelegramConnection();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await dashboardService.getStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkTelegramConnection = async () => {
    const settings = telegramService.getSettings();
    setTelegramConnected(
      settings.isEnabled && !!settings.botToken && !!settings.chatId
    );
  };

  const sendTestNotification = async () => {
    try {
      const success = await telegramService.sendMessage({
        chatId: telegramService.getSettings().chatId,
        text: "🧪 <b>اختبار الإشعارات - سايبس ليبيا</b>\n\nتم إرسال هذا الإشعار بنجاح من لوحة التحكم.",
      });

      if (success) {
        alert("تم إرسال الإشعار بنجاح!");
      } else {
        alert("فشل في إرسال الإشعار. تحقق من إعدادات Telegram.");
      }
    } catch (error) {
      console.error("Failed to send test notification:", error);
      alert("حدث خطأ في إرسال الإشعار.");
    }
  };

  const statCards = [
    {
      title: "إجمالي المنتجات",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "إجمالي العملاء",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-purple-500",
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "إجمالي الإيرادات",
      value: `د.ل ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "+22%",
      changeType: "positive",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            لوحة التحكم
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            نظرة عامة على نشاط متجر سايبس ليبيا
          </p>
        </div>

        {/* Telegram Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              telegramConnected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                telegramConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs sm:text-sm font-medium">
              {telegramConnected ? "Telegram متصل" : "Telegram غير متصل"}
            </span>
          </div>

          {telegramConnected && (
            <button
              onClick={sendTestNotification}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap"
            >
              اختبار الإشعار
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            الإيرادات الشهرية
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني للإيرادات</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                د.ل {stats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            طلبات الأسبوع
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">طلبات هذا الأسبوع</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.weeklyOrders} طلب
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pending Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              الطلبات المعلقة
            </h3>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
            <p className="text-gray-600 mt-2">طلب يحتاج إلى مراجعة</p>
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">مخزون منخفض</h3>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {stats.lowStockProducts}
            </p>
            <p className="text-gray-600 mt-2">منتج يحتاج إلى إعادة تخزين</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          الإجراءات السريعة
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={loadDashboardData}
            className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
          >
            <RefreshCw className="w-5 h-5" />
            تحديث البيانات
          </button>

          <button
            onClick={() => (window.location.href = "/admin/products")}
            className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
          >
            <Package className="w-5 h-5" />
            إدارة المنتجات
          </button>

          <button
            onClick={() => (window.location.href = "/admin/orders")}
            className="flex items-center justify-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            إدارة الطلبات
          </button>
        </div>
      </motion.div>
    </div>
  );
}
