import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, Send } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { telegramService } from "../services/telegramService";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    notes: "",
  });

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success("تم حذف المنتج من السلة");
  };

  const handleIncreaseQuantity = (
    productId: string,
    currentQuantity: number
  ) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (
    productId: string,
    currentQuantity: number
  ) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      handleRemoveItem(productId);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!customerInfo.name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    if (!customerInfo.phone.trim()) {
      toast.error("رقم الهاتف مطلوب");
      return;
    }
    if (!customerInfo.address.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }

    setLoading(true);

    try {
      // Prepare cart data for Telegram
      const cartData = {
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        total: getTotal(),
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          email: customerInfo.email,
          notes: customerInfo.notes,
        },
      };

      const success = await telegramService.sendCartNotification(cartData);

      if (success) {
        toast.success("تم إرسال طلبك بنجاح!");
        clearCart();
        setShowCheckoutForm(false);
        setCustomerInfo({
          name: "",
          phone: "",
          address: "",
          email: "",
          notes: "",
        });
      } else {
        toast.error("فشل في إرسال الطلب. تحقق من إعدادات Telegram.");
      }
    } catch (error) {
      console.error("Failed to send order:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-6">
            لم تقم بإضافة أي منتجات للسلة بعد
          </p>
          <Link
            to="/products"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            سلة التسوق
          </h1>
          <p className="text-gray-600">{items.length} منتج في السلة</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart size={32} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <div className="text-red-600 font-bold text-lg mb-2">
                      {item.price} د.ل
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleDecreaseQuantity(item.productId, item.quantity)
                        }
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-gray-900 font-bold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleIncreaseQuantity(item.productId, item.quantity)
                        }
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Total and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-xl font-black text-red-600 mb-2">
                      {item.price * item.quantity} د.ل
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>عدد المنتجات:</span>
                  <span className="font-bold">{items.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الكمية الإجمالية:</span>
                  <span className="font-bold">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-black text-gray-900">
                  <span>المجموع:</span>
                  <span className="text-red-600">{getTotal()} د.ل</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckoutForm(true)}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-red-500/25 mb-3"
              >
                إتمام الطلب
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                مسح السلة
              </button>

              <Link
                to="/products"
                className="block w-full text-center text-gray-600 hover:text-red-600 transition mt-4"
              >
                ← متابعة التسوق
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    إتمام الطلب
                  </h2>
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="أدخل اسمك"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="أدخل رقم هاتفك"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      العنوان <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="أدخل عنوانك"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      البريد الإلكتروني{" "}
                      <span className="text-gray-400 text-xs">(اختياري)</span>
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      ملاحظات{" "}
                      <span className="text-gray-400 text-xs">(اختياري)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="أي ملاحظات إضافية..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send size={20} />
                      {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
