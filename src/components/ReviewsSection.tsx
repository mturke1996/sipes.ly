import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { reviewsService } from "../services/databaseService";
import { Review } from "../types/database";
import AddReviewForm from "./AddReviewForm";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadReviews = async () => {
    try {
      const data = await reviewsService.getActive();
      setReviews(data.slice(0, 6)); // عرض أول 6 تقيمات فقط
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // احسب متوسط التقييم
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 4.8;

  return (
    <section
      id="reviews"
      className="py-16 md:py-24 bg-gradient-to-br from-red-50 via-red-50 to-red-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            آراء عملائنا الراضين
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            ماذا يقول آلاف العملاء الذين وثقوا بنا وحصلوا على أفضل النتائج
          </p>
        </motion.div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">جاري تحميل التقيمات...</div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">لا توجد تقيمات متاحة حالياً</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                className="group"
              >
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 h-full relative overflow-hidden">
                  {/* Decorative Quote Icon */}
                  <div className="absolute -top-8 -left-8 w-24 h-24 bg-red-100 rounded-full opacity-30 group-hover:opacity-50 transition"></div>

                  {/* Quote Icon */}
                  <Quote className="text-red-200 mb-4" size={32} />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <Star
                        key={`empty-${i}`}
                        size={18}
                        className="text-gray-300"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed line-clamp-3">
                    "{review.text}"
                  </p>

                  {/* Reply if exists */}
                  {review.reply && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border-r-4 border-blue-500">
                      <div className="text-xs font-bold text-blue-600 mb-1">
                        رد المتجر:
                      </div>
                      <p className="text-sm text-blue-700">{review.reply}</p>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-4"></div>

                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          review.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.id}`
                        }
                        alt={review.name}
                        className="w-12 h-12 rounded-full ring-2 ring-red-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                            {review.name}
                          </h3>
                          {review.verified && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              ✓ موثّق
                            </span>
                          )}
                        </div>
                        {review.location && (
                          <p className="text-gray-500 text-xs sm:text-sm">
                            {review.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            <div className="p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                {averageRating.toFixed(1)}★
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                متوسط التقييم
              </p>
            </div>
            <div className="p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                +{reviews.length}K
              </div>
              <p className="text-gray-600 text-sm sm:text-base">عميل راضي</p>
            </div>
            <div className="p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                98%
              </div>
              <p className="text-gray-600 text-sm sm:text-base">رضا العملاء</p>
            </div>
            <div className="p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                24/7
              </div>
              <p className="text-gray-600 text-sm sm:text-base">دعم فني</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            انضم إلى آلاف العملاء الراضين! شارك تجربتك معنا
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            اترك تقييمك الآن
          </button>
        </motion.div>
      </div>

      {/* Add Review Form Modal */}
      {showAddForm && (
        <AddReviewForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => loadReviews()}
        />
      )}
    </section>
  );
}
