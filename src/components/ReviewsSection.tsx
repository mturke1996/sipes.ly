import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: 'أحمد محمد',
      text: 'منتجات رائعة وخدمة عملاء ممتازة! التوصيل كان سريع جدًا.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    {
      id: 2,
      name: 'فاطمة علي',
      text: 'الدهان الذي اشتريته جودة عالية جدًا ولم ينجرح بسهولة.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    },
    {
      id: 3,
      name: 'محمود الحسن',
      text: 'سعر مناسب وجودة ممتازة. سأشتري منهم مرة أخرى.',
      rating: 4,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    },
  ];

  return (
    <section id="reviews" className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">آراء عملائنا</h2>
          <p className="text-gray-600 text-lg">ماذا يقول عملاؤنا عن خدماتنا</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg">{review.name}</h3>
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
