import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Settings,
  MessageSquare,
  TestTube,
  Save,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { telegramService } from "../../services/telegramService";
import { TelegramSettings as TelegramSettingsType } from "../../types/database";

export default function TelegramSettings() {
  const [settings, setSettings] = useState<TelegramSettingsType>({
    botToken: "",
    chatId: "",
    isEnabled: false,
    notifications: {
      newOrder: true,
      orderUpdate: true,
      lowStock: true,
      dailyReport: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const currentSettings = telegramService.getSettings();
    setSettings(currentSettings);
    setConnectionStatus(
      currentSettings.isEnabled &&
        currentSettings.botToken &&
        currentSettings.chatId
        ? "connected"
        : "disconnected"
    );
  };

  // ✅ تعديل: إرسال رسالة ترحيبية بعد الحفظ الناجح
  const handleSave = async () => {
    try {
      setLoading(true);
      await telegramService.saveSettings(settings);
      toast.success("تم حفظ الإعدادات بنجاح");
      loadSettings();

      // إذا كانت الإعدادات مفعّلة وقيم الاتصال صحيحة، أرسل الترحيب
      if (settings.isEnabled && settings.botToken && settings.chatId) {
        const welcomeMessage = `
🎉 <b>مرحباً بك!</b>
تم ربط البوت بنجاح مع نظام سايبس ليبيا 🚀

📢 ستتلقى الآن الإشعارات مباشرة عبر Telegram.

⏰ ${new Date().toLocaleString("ar-LY")}
        `;

        const success = await telegramService.sendMessage({
          chatId: settings.chatId,
          text: welcomeMessage,
        });

        if (success) {
          toast.success("✅ تم إرسال رسالة الترحيب بنجاح!");
        } else {
          toast.error("⚠️ فشل في إرسال رسالة الترحيب");
        }
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("فشل في حفظ الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      const success = await telegramService.testConnection();

      if (success) {
        toast.success("تم اختبار الاتصال بنجاح!");
        setConnectionStatus("connected");
      } else {
        toast.error("فشل في اختبار الاتصال");
        setConnectionStatus("disconnected");
      }
    } catch (error) {
      console.error("Test failed:", error);
      toast.error("حدث خطأ في الاختبار");
      setConnectionStatus("disconnected");
    } finally {
      setTesting(false);
    }
  };

  const handleSendTestMessage = async () => {
    try {
      setTesting(true);
      const success = await telegramService.sendMessage({
        chatId: settings.chatId,
        text:
          "🧪 <b>اختبار الإشعارات - سايبس ليبيا</b>\n\nتم إرسال هذا الإشعار بنجاح من لوحة التحكم.\n\n⏰ الوقت: " +
          new Date().toLocaleString("ar-LY"),
      });

      if (success) {
        toast.success("تم إرسال الرسالة التجريبية بنجاح!");
      } else {
        toast.error("فشل في إرسال الرسالة التجريبية");
      }
    } catch (error) {
      console.error("Failed to send test message:", error);
      toast.error("حدث خطأ في إرسال الرسالة");
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "disconnected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "متصل";
      case "disconnected":
        return "غير متصل";
      default:
        return "غير محدد";
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600 bg-green-100";
      case "disconnected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            إعدادات Telegram
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            إعداد الإشعارات والربط مع Telegram
          </p>
        </div>

        {/* Connection Status */}
        <div
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span className="text-sm sm:text-base font-medium">
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Settings Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            الإعدادات الأساسية
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Bot Token */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Bot Token <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={settings.botToken}
              onChange={(e) =>
                setSettings({ ...settings, botToken: e.target.value })
              }
              placeholder="أدخل Bot Token من @BotFather"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              احصل على Bot Token من @BotFather في Telegram
            </p>
          </div>

          {/* Chat ID */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Chat ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={settings.chatId}
              onChange={(e) =>
                setSettings({ ...settings, chatId: e.target.value })
              }
              placeholder="أدخل Chat ID أو Username"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Chat ID أو Username للدردشة التي ستستقبل الإشعارات
            </p>
          </div>

          {/* Enable/Disable */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isEnabled"
              checked={settings.isEnabled}
              onChange={(e) =>
                setSettings({ ...settings, isEnabled: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isEnabled"
              className="text-sm font-medium text-gray-700"
            >
              تفعيل إشعارات Telegram
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            <Save size={18} />
            {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </div>
      </motion.div>

      {/* Test Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <TestTube className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            اختبار الاتصال
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={handleTest}
            disabled={testing || !settings.botToken || !settings.chatId}
            className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition disabled:opacity-50 text-sm sm:text-base"
          >
            <CheckCircle size={18} className="sm:size-5" />
            {testing ? "جاري الاختبار..." : "اختبار الاتصال"}
          </button>

          <button
            onClick={handleSendTestMessage}
            disabled={testing || !settings.botToken || !settings.chatId}
            className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 text-sm sm:text-base"
          >
            <MessageSquare size={18} className="sm:size-5" />
            {testing ? "جاري الإرسال..." : "إرسال رسالة تجريبية"}
          </button>
        </div>

        <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
            كيفية الحصول على Bot Token و Chat ID:
          </h3>
          <ol className="text-xs sm:text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>ابحث عن @BotFather في Telegram</li>
            <li>أرسل الأمر /newbot وإنشئ بوت جديد</li>
            <li>انسخ Bot Token المعطى لك</li>
            <li>أضف البوت إلى المجموعة أو المحادثة المطلوبة</li>
            <li>ابحث عن @userinfobot في Telegram للحصول على Chat ID</li>
            <li>انسخ Chat ID وأرسله للبوت</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
}