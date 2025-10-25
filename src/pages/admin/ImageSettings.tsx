import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Save,
  Image as ImageIcon,
  Settings,
  Upload,
  AlertTriangle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { imageUploadService } from "../../services/imageUploadService";

export default function ImageSettings() {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [testImage, setTestImage] = useState<File | null>(null);
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [uploadTestResult, setUploadTestResult] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const savedApiKey =
      localStorage.getItem("imgbb_api_key") ||
      "2ba5baf77d802151c6931dea841d6abe";
    setApiKey(savedApiKey);
    setIsLoading(false);
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("imgbb_api_key", apiKey);
    toast.success("تم حفظ مفتاح API بنجاح!");
  };

  const handleValidateApiKey = async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      // تحديث مفتاح API للاختبار
      imageUploadService.setApiKey(apiKey);

      const isValid = await imageUploadService.validateApiKey();
      setValidationResult(isValid);

      if (isValid) {
        toast.success("مفتاح API صحيح!");
      } else {
        toast.error("مفتاح API غير صحيح!");
      }
    } catch (error) {
      console.error("API validation failed:", error);
      setValidationResult(false);
      toast.error("فشل في التحقق من مفتاح API");
    } finally {
      setIsValidating(false);
    }
  };

  const handleTestUpload = async () => {
    if (!testImage) {
      toast.error("يرجى اختيار صورة للاختبار");
      return;
    }

    setIsTestingUpload(true);
    setUploadTestResult(null);

    try {
      const response = await imageUploadService.uploadImage({
        file: testImage,
      });
      setUploadTestResult(true);
      toast.success("تم رفع الصورة بنجاح!");

      // عرض معلومات الصورة المرفوعة
      const imageInfo = imageUploadService.getImageInfo(response);
      console.log("Uploaded image info:", imageInfo);

      // حذف الصورة التجريبية بعد الاختبار
      if (response?.data?.delete_url) {
        setTimeout(async () => {
          try {
            await imageUploadService.deleteImage(response.data.delete_url);
            console.log("Test image deleted successfully");
          } catch (deleteError) {
            console.warn("Failed to delete test image:", deleteError);
          }
        }, 5000); // حذف بعد 5 ثوان
      }
    } catch (error) {
      console.error("Upload test failed:", error);
      setUploadTestResult(false);
      toast.error("فشل في رفع الصورة");
    } finally {
      setIsTestingUpload(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestImage(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <ImageIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">إعدادات رفع الصور</h1>
      </div>

      <div className="space-y-8">
        {/* API Key Configuration */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              إعدادات ImgBB API
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                مفتاح API (API Key)
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل مفتاح API الخاص بك"
              />
              <p className="mt-2 text-sm text-gray-500">
                يمكنك الحصول على مفتاح API من{" "}
                <a
                  href="https://api.imgbb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ImgBB
                </a>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveApiKey}
                className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
              >
                <Save size={20} />
                حفظ المفتاح
              </button>

              <button
                onClick={handleValidateApiKey}
                disabled={isValidating || !apiKey}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  "جاري التحقق..."
                ) : (
                  <>
                    <CheckCircle size={20} />
                    التحقق من المفتاح
                  </>
                )}
              </button>
            </div>

            {validationResult !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  validationResult
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {validationResult ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
                <p className="font-medium">
                  {validationResult
                    ? "مفتاح API صحيح ويمكن استخدامه"
                    : "مفتاح API غير صحيح. يرجى التحقق من المفتاح وحاول مرة أخرى"}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Upload Test */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              اختبار رفع الصور
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="testImage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                اختر صورة للاختبار
              </label>
              <input
                type="file"
                id="testImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {testImage && (
                <p className="mt-2 text-sm text-gray-600">
                  الملف المختار: {testImage.name} (
                  {(testImage.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <button
              onClick={handleTestUpload}
              disabled={isTestingUpload || !testImage}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingUpload ? (
                "جاري الرفع..."
              ) : (
                <>
                  <Upload size={20} />
                  اختبار الرفع
                </>
              )}
            </button>

            {uploadTestResult !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  uploadTestResult
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {uploadTestResult ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
                <p className="font-medium">
                  {uploadTestResult
                    ? "تم رفع الصورة بنجاح! يمكنك الآن استخدام خدمة رفع الصور"
                    : "فشل في رفع الصورة. تحقق من مفتاح API وحاول مرة أخرى"}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-900">
              معلومات مهمة
            </h2>
          </div>

          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                <strong>حدود الاستخدام:</strong> يمكن رفع صور بحجم أقصى 32MB لكل
                صورة
              </p>
            </div>

            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                <strong>أنواع الملفات المدعومة:</strong> JPG, PNG, GIF, WEBP
              </p>
            </div>

            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                <strong>الأمان:</strong> يتم حذف الصور تلقائياً بعد انتهاء
                صلاحية المفتاح
              </p>
            </div>

            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                <strong>الخصوصية:</strong> الصور المرفوعة تكون عامة ويمكن الوصول
                إليها عبر الرابط
              </p>
            </div>
          </div>
        </div>

        {/* Current Settings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            الإعدادات الحالية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مفتاح API الحالي
              </label>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                {apiKey ? `${apiKey.substring(0, 8)}...` : "غير محدد"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حالة الخدمة
              </label>
              <p
                className={`text-sm font-medium ${
                  validationResult === true
                    ? "text-green-600"
                    : validationResult === false
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {validationResult === true
                  ? "نشطة"
                  : validationResult === false
                  ? "غير نشطة"
                  : "غير محدد"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
