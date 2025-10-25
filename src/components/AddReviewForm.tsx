import { useState } from "react";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import { reviewsService } from "../services/databaseService";

interface AddReviewFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddReviewForm({
  onClose,
  onSuccess,
}: AddReviewFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    rating: 5,
    location: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    if (!formData.text.trim()) {
      toast.error("نص التقييم مطلوب");
      return;
    }

    setLoading(true);

    try {
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`;

      await reviewsService.create({
        name: formData.name,
        text: formData.text,
        rating: formData.rating,
        location: formData.location || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        avatar,
        verified: false,
        isActive: false, // سيتم تفعيله من لوحة التحكم
      });

      toast.success("شكراً لك! تم إرسال تقييمك بنجاح وسيتم مراجعته قريباً");
      setFormData({
        name: "",
        text: "",
        rating: 5,
        location: "",
        email: "",
        phone: "",
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">إضافة تقييم</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="أدخل اسمك"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              التقييم <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: i + 1 })}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition"
                >
                  <Star
                    size={32}
                    className={
                      i + 1 <= (hoveredRating || formData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              نص التقييم <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="اكتب تقييمك هنا..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              الموقع <span className="text-gray-400 text-xs">(اختياري)</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="مثال: طرابلس"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              البريد الإلكتروني{" "}
              <span className="text-gray-400 text-xs">(اختياري)</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              رقم الهاتف{" "}
              <span className="text-gray-400 text-xs">(اختياري)</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="0912345678"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
