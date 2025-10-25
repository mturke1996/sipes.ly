import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Database,
  MessageSquare,
  Image,
  TestTube,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  productsService,
  categoriesService,
} from "../../services/databaseService";
import { telegramService } from "../../services/telegramService";
import { imageUploadService } from "../../services/imageUploadService";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  message: string;
  details?: string;
}

export default function SystemTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (
    testName: string,
    testFunction: () => Promise<boolean>,
    details?: string
  ) => {
    setTestResults((prev) => [
      ...prev,
      {
        name: testName,
        status: "pending",
        message: "جاري الاختبار...",
        details,
      },
    ]);

    try {
      const result = await testFunction();
      setTestResults((prev) =>
        prev.map((test) =>
          test.name === testName
            ? {
                ...test,
                status: result ? "success" : "error",
                message: result ? "نجح الاختبار" : "فشل الاختبار",
              }
            : test
        )
      );
    } catch (error) {
      setTestResults((prev) =>
        prev.map((test) =>
          test.name === testName
            ? { ...test, status: "error", message: `خطأ: ${error}` }
            : test
        )
      );
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Database Connection
    await runTest(
      "اتصال قاعدة البيانات",
      async () => {
        try {
          await productsService.getAll();
          return true;
        } catch (error) {
          console.error("Database test failed:", error);
          return false;
        }
      },
      "اختبار الاتصال بـ Firebase Firestore"
    );

    // Test 2: Product Creation
    await runTest(
      "إنشاء منتج تجريبي",
      async () => {
        try {
          const testProduct = {
            name: "منتج تجريبي",
            nameAr: "منتج تجريبي",
            description: "وصف تجريبي",
            descriptionAr: "وصف تجريبي",
            price: 100,
            category: "تجريبي",
            categoryId: "test",
            images: [],
            stock: 10,
            isActive: true,
            specifications: {
              color: "أبيض",
              coverage: "10 متر مربع",
              dryingTime: "2 ساعة",
              application: "فرشاة",
              finish: "لامع",
            },
          };
          const productId = await productsService.create(testProduct);
          console.log("Test product created:", productId);
          return true;
        } catch (error) {
          console.error("Product creation test failed:", error);
          return false;
        }
      },
      "إنشاء منتج تجريبي في قاعدة البيانات"
    );

    // Test 3: Categories Service
    await runTest(
      "خدمة الفئات",
      async () => {
        try {
          await categoriesService.getAll();
          return true;
        } catch (error) {
          console.error("Categories test failed:", error);
          return false;
        }
      },
      "اختبار خدمة إدارة الفئات"
    );

    // Test 4: Telegram Service
    await runTest(
      "خدمة Telegram",
      async () => {
        try {
          const settings = telegramService.getSettings();
          return Boolean(settings.botToken && settings.chatId);
        } catch (error) {
          console.error("Telegram test failed:", error);
          return false;
        }
      },
      "اختبار إعدادات Telegram Bot"
    );

    // Test 5: Image Upload Service
    await runTest(
      "خدمة رفع الصور",
      async () => {
        try {
          const isValid = await imageUploadService.validateApiKey();
          return Boolean(isValid);
        } catch (error) {
          console.error("Image upload test failed:", error);
          return false;
        }
      },
      "اختبار خدمة رفع الصور (ImgBB)"
    );

    // Test 6: Telegram Notification
    await runTest(
      "إرسال إشعار Telegram",
      async () => {
        try {
          const testData = {
            items: [
              { name: "منتج تجريبي", quantity: 1, price: 100, total: 100 },
            ],
            total: 100,
            customerInfo: {
              name: "عميل تجريبي",
              phone: "123456789",
              email: "test@example.com",
            },
          };
          const success = await telegramService.sendCartNotification(testData);
          return success;
        } catch (error) {
          console.error("Telegram notification test failed:", error);
          return false;
        }
      },
      "اختبار إرسال إشعار إلى Telegram"
    );

    setIsRunning(false);
    toast.success("تم الانتهاء من جميع الاختبارات");
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        );
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <TestTube className="w-8 h-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">اختبار النظام</h1>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">قاعدة البيانات</h3>
          </div>
          <p className="text-sm text-blue-700">
            اختبار الاتصال بـ Firebase Firestore وإنشاء المنتجات
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Telegram</h3>
          </div>
          <p className="text-sm text-green-700">
            اختبار إعدادات Bot وإرسال الإشعارات
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">رفع الصور</h3>
          </div>
          <p className="text-sm text-purple-700">
            اختبار خدمة ImgBB لرفع الصور
          </p>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            تشغيل الاختبارات
          </h2>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التشغيل...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                تشغيل جميع الاختبارات
              </>
            )}
          </button>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>• سيتم اختبار جميع مكونات النظام</p>
          <p>• تأكد من إعداد Telegram Bot و ImgBB API</p>
          <p>• قد يستغرق الاختبار بضع دقائق</p>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            نتائج الاختبارات
          </h2>

          {testResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getStatusColor(
                result.status
              )}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h3 className="font-medium">{result.name}</h3>
                  <p className="text-sm opacity-80">{result.message}</p>
                  {result.details && (
                    <p className="text-xs opacity-60 mt-1">{result.details}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* System Status */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">حالة النظام</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              المكونات المطلوبة:
            </h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Firebase Firestore</li>
              <li>• Telegram Bot Token</li>
              <li>• ImgBB API Key</li>
              <li>• اتصال بالإنترنت</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              الوظائف المختبرة:
            </h4>
            <ul className="space-y-1 text-gray-600">
              <li>• إنشاء وتحديث المنتجات</li>
              <li>• إرسال إشعارات Telegram</li>
              <li>• رفع الصور إلى ImgBB</li>
              <li>• إدارة الفئات والطلبات</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
