import { useState } from "react";
import { Send, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { telegramService } from "../services/telegramService";

interface CartTelegramSenderProps {
  cartItems: any[];
  total: number;
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  onSent?: () => void;
}

export default function CartTelegramSender({
  cartItems,
  total,
  customerInfo,
  onSent,
}: CartTelegramSenderProps) {
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleSendToTelegram = async () => {
    if (cartItems.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    setIsSending(true);
    setSentStatus("idle");

    try {
      const cartData = {
        items: cartItems,
        total,
        customerInfo: customerInfo || {},
        timestamp: new Date().toISOString(),
      };

      const success = await telegramService.sendCartNotification(cartData);

      if (success) {
        setSentStatus("success");
        toast.success("تم إرسال الطلب إلى Telegram بنجاح!");
        onSent?.();
      } else {
        setSentStatus("error");
        toast.error("فشل في إرسال الطلب إلى Telegram");
      }
    } catch (error) {
      console.error("Error sending to Telegram:", error);
      setSentStatus("error");
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = () => {
    switch (sentStatus) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (sentStatus) {
      case "success":
        return "تم الإرسال بنجاح";
      case "error":
        return "فشل في الإرسال";
      default:
        return "إرسال إلى Telegram";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        {getStatusIcon()}
        <h3 className="text-lg font-semibold text-gray-900">
          إرسال الطلب إلى Telegram
        </h3>
      </div>

      <div className="space-y-4">
        {/* Cart Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">ملخص الطلب:</h4>
          <div className="space-y-2">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.total} دينار</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>المجموع الكلي:</span>
              <span>{total} دينار</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {customerInfo && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">معلومات العميل:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              {customerInfo.name && <div>الاسم: {customerInfo.name}</div>}
              {customerInfo.phone && <div>الهاتف: {customerInfo.phone}</div>}
              {customerInfo.email && (
                <div>البريد الإلكتروني: {customerInfo.email}</div>
              )}
            </div>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSendToTelegram}
          disabled={isSending || cartItems.length === 0}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
            sentStatus === "success"
              ? "bg-green-600 text-white hover:bg-green-700"
              : sentStatus === "error"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {getStatusText()}
            </>
          )}
        </button>

        {/* Status Message */}
        {sentStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm font-medium ${
              sentStatus === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {sentStatus === "success"
              ? "تم إرسال الطلب إلى Telegram بنجاح! سيتم إشعار فريق العمل."
              : "فشل في إرسال الطلب. تحقق من إعدادات Telegram وحاول مرة أخرى."}
          </motion.div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• تأكد من إعداد Telegram Bot في لوحة التحكم</p>
          <p>• سيتم إرسال تفاصيل الطلب إلى المجموعة المحددة</p>
          <p>• يمكنك تتبع حالة الطلب من خلال Telegram</p>
        </div>
      </div>
    </motion.div>
  );
}
