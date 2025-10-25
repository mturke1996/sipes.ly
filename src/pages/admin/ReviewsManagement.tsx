import { useState, useEffect } from "react";
import { Star, MessageSquare, Trash2, Eye, EyeOff, Reply } from "lucide-react";
import toast from "react-hot-toast";
import { reviewsService } from "../../services/databaseService";
import { Review } from "../../types/database";

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsService.getAll();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("فشل في تحميل التقيمات");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await reviewsService.update(id, { isActive: !isActive });
      toast.success("تم تحديث حالة التقييم");
      loadReviews();
    } catch (error) {
      toast.error("فشل في تحديث التقييم");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;

    try {
      await reviewsService.delete(id);
      toast.success("تم حذف التقييم");
      loadReviews();
    } catch (error) {
      toast.error("فشل في حذف التقييم");
    }
  };

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) {
      toast.error("الرجاء إدخال رد");
      return;
    }

    try {
      await reviewsService.addReply(selectedReview.id, replyText);
      toast.success("تم إضافة الرد");
      setReplyText("");
      setShowReplyForm(false);
      setSelectedReview(null);
      loadReviews();
    } catch (error) {
      toast.error("فشل في إضافة الرد");
    }
  };

  const getStatusBadge = (review: Review) => {
    if (!review.isActive) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
          مخفي
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
        ظاهر
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة التقيمات</h1>
        <div className="text-sm text-gray-500">
          إجمالي التقيمات: {reviews.length}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقييم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاسم والموقع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النص
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, i) => (
                        <Star
                          key={`empty-${i}`}
                          size={16}
                          className="text-gray-300"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {review.name}
                      </div>
                      {review.location && (
                        <div className="text-sm text-gray-500">
                          {review.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">
                      {review.text}
                    </div>
                    {review.reply && (
                      <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        <div className="font-medium">الرد:</div>
                        {review.reply}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(review)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleActive(review.id, review.isActive)
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title={review.isActive ? "إخفاء" : "إظهار"}
                      >
                        {review.isActive ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setShowReplyForm(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="رد"
                      >
                        <Reply size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyForm && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">إضافة رد على التقييم</h2>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">التقييم:</div>
              <div className="bg-gray-50 p-3 rounded">
                {selectedReview.text}
              </div>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              placeholder="اكتب ردك هنا..."
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleReply}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                إرسال الرد
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setSelectedReview(null);
                  setReplyText("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
