import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Truck,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import Hero from "../components/Hero";
import FeaturedSection from "../components/FeaturedSection";
import ReviewsSection from "../components/ReviewsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { productsService } from "../services/databaseService";
import { Product } from "../types/database";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      // Show only first 6 active products
      setProducts(data.filter((p) => p.isActive).slice(0, 6));
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.nameAr || product.name,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: 1,
        type: product.category,
      };
      addItem(cartItem);
      toast.success("تم إضافة المنتج للسلة");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("فشل في إضافة المنتج للسلة");
    }
  };
  const features = [
    {
      icon: Palette,
      title: "جودة عالية",
      description: "دهانات وطلاءات بأعلى معايير الجودة العالمية",
    },
    {
      icon: Truck,
      title: "توصيل سريع",
      description: "توصيل مجاني لطلبات معينة داخل طرابلس",
    },
    {
      icon: Award,
      title: "شهادات عالمية",
      description: "منتجات معتمدة وموثوقة من أفضل الشركات العالمية",
    },
    {
      icon: Users,
      title: "فريق احترافي",
      description: "فريق متخصص لتقديم أفضل الخدمات والاستشارات",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4"
            >
              لماذا اختيار SIPES؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
            >
              نحن نقدم أفضل الدهانات والطلاءات بأسعار تنافسية وخدمة عملاء ممتازة
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Icon
                      className="text-red-600 group-hover:text-red-700"
                      size={28}
                    />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedSection />

      {/* Products Section */}
      <section
        id="products"
        className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4"
            >
              منتجاتنا المتنوعة
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
            >
              اختر من مجموعة واسعة من الدهانات والطلاءات عالية الجودة
            </motion.p>
          </div>

          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">
                جاري تحميل المنتجات...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <ShoppingCart
                size={48}
                className="sm:size-64 text-gray-300 mx-auto mb-4"
              />
              <p className="text-lg sm:text-xl text-gray-600 mb-2">
                لا توجد منتجات متاحة
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                قم بإضافة منتجات من لوحة التحكم
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group h-full"
                  >
                    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition duration-300 h-full flex flex-col border border-gray-100">
                      {/* Image */}
                      <div className="relative overflow-hidden bg-gray-100 aspect-square">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.nameAr || product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                            <ShoppingCart
                              size={48}
                              className="sm:size-64 text-red-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                        {/* Category */}
                        <div className="text-xs sm:text-sm text-red-600 font-semibold mb-1 sm:mb-2">
                          {product.category}
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                          {product.nameAr || product.name}
                        </h3>

                        {/* Description */}
                        {product.descriptionAr && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                            {product.descriptionAr}
                          </p>
                        )}

                        {/* Price */}
                        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-200">
                          <div>
                            <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-600">
                              {product.price} د.ل
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              السعر
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full sm:w-auto bg-red-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-red-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <ShoppingCart size={16} className="sm:size-5" />
                            <span>أضف للسلة</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-8 sm:mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="inline-block"
                >
                  <a
                    href="/products"
                    className="bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-red-700 transition shadow-lg flex items-center gap-2 sm:gap-3"
                  >
                    <Palette size={20} className="sm:size-6" />
                    <span>تصفح جميع المنتجات</span>
                    <ArrowRight size={18} className="sm:size-5" />
                  </a>
                </motion.div>
              </div>
            </>
          )}
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
