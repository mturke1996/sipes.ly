import { motion } from 'framer-motion';
import { Palette, Truck, Award, Users, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import ReviewsSection from '../components/ReviewsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function HomePage() {
  const features = [
    {
      icon: Palette,
      title: 'جودة عالية',
      description: 'دهانات وطلاءات بأعلى معايير الجودة العالمية',
    },
    {
      icon: Truck,
      title: 'توصيل سريع',
      description: 'توصيل مجاني لطلبات معينة داخل طرابلس',
    },
    {
      icon: Award,
      title: 'شهادات عالمية',
      description: 'منتجات معتمدة وموثوقة من أفضل الشركات العالمية',
    },
    {
      icon: Users,
      title: 'فريق احترافي',
      description: 'فريق متخصص لتقديم أفضل الخدمات والاستشارات',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              لماذا اختيار سايبس؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              نحن نقدم أفضل الدهانات والطلاءات بأسعار تنافسية وخدمة عملاء ممتازة
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedSection />

      {/* Demo Products Section */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              منتجاتنا التجريبية
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'دهان داخلي فاخر',
                price: '45 ₪',
                image: 'https://images.unsplash.com/photo-1578519603510-e3fb19a540d6?w=500&h=500&fit=crop',
                type: 'داخلي',
              },
              {
                name: 'دهان خارجي مقاوم',
                price: '65 ₪',
                image: 'https://images.unsplash.com/photo-1589939705882-c6cf27e10e5e?w=500&h=500&fit=crop',
                type: 'خارجي',
              },
              {
                name: 'طلاء متخصص',
                price: '85 ₪',
                image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
                type: 'متخصص',
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group cursor-pointer"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                    >
                      إضافة للسلة
                      <ArrowRight size={20} />
                    </motion.div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-blue-600 text-sm font-medium">{product.type}</span>
                  <h3 className="font-bold text-lg mt-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">جودة عالية وأسعار منافسة</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      تفاصيل
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
