import { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Edit,
  Trash2,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ordersService,
  customersService,
} from "../../services/databaseService";
import { telegramService } from "../../services/telegramService";
import { Order, Customer } from "../../types/database";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, customersData] = await Promise.all([
        ordersService.getAll(),
        customersService.getAll(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersService.update(orderId, { status: newStatus as any });

      // Send Telegram notification if enabled
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        await telegramService.sendNotification({
          type: "orderUpdate",
          data: { ...order, status: newStatus },
        });
      }

      toast.success("تم تحديث حالة الطلب بنجاح");
      loadData();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("فشل في تحديث حالة الطلب");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("هل تريد حذف هذا الطلب؟")) {
      try {
        await ordersService.update(orderId, { status: "cancelled" });
        toast.success("تم إلغاء الطلب");
        loadData();
      } catch (error) {
        console.error("Failed to cancel order:", error);
        toast.error("فشل في إلغاء الطلب");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: "في الانتظار",
      confirmed: "مؤكد",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          إدارة الطلبات
        </h1>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw size={18} />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن طلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">في الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="processing">قيد المعالجة</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">رقم الطلب</th>
                <th className="px-6 py-3 text-right">العميل</th>
                <th className="px-6 py-3 text-right">الإجمالي</th>
                <th className="px-6 py-3 text-right">الحالة</th>
                <th className="px-6 py-3 text-right">التاريخ</th>
                <th className="px-6 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-bold">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        {order.customer?.name || "غير محدد"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer?.phone || "لا يوجد"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-bold">
                    {order.totalAmount.toLocaleString()} د.ل
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-sm font-bold border-0 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">في الانتظار</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التسليم</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString("ar-LY")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                        title="إلغاء الطلب"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد طلبات مطابقة للبحث
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                تفاصيل الطلب #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">معلومات العميل</h3>
                <p>
                  <strong>الاسم:</strong> {selectedOrder.customer?.name}
                </p>
                <p>
                  <strong>الهاتف:</strong> {selectedOrder.customer?.phone}
                </p>
                <p>
                  <strong>البريد الإلكتروني:</strong>{" "}
                  {selectedOrder.customer?.email}
                </p>
                <p>
                  <strong>العنوان:</strong> {selectedOrder.shippingAddress}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">المنتجات</h3>
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">
                        {item.product?.nameAr || item.product?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        الكمية: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      {item.total.toLocaleString()} د.ل
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    المجموع الإجمالي:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {selectedOrder.totalAmount.toLocaleString()} د.ل
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">ملاحظات</h3>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
