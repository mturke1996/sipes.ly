import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { productsService } from "../services/databaseService";
import { Product } from "../types/database";
import toast from "react-hot-toast";

export default function ProductsPage() {
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
      setProducts(data.filter((p) => p.isActive));
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("فشل في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log("Adding product to cart:", product);
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
      console.log("Cart item:", cartItem);
      addItem(cartItem);
      console.log("Product added successfully");
      toast.success("تم إضافة المنتج للسلة");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("فشل في إضافة المنتج للسلة");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            منتجاتنا
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            مجموعة واسعة من منتجات الدهانات والطلاء عالية الجودة
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">لا توجد منتجات متاحة</p>
            <p className="text-gray-500">قم بإضافة منتجات من لوحة التحكم</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group h-full"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 h-full flex flex-col">
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
                        <ShoppingCart size={64} className="text-red-300" />
                      </div>
                    )}

                    {/* Stock Badge */}
                    {product.stock <= 10 && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        مخزون منخفض
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-center pb-6">
                      <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        إضافة للسلة
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    {/* Category */}
                    <div className="text-sm text-red-600 font-semibold mb-2">
                      {product.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {product.nameAr || product.name}
                    </h3>

                    {/* Description */}
                    {product.descriptionAr && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.descriptionAr}
                      </p>
                    )}

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features?.easyToApply && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          ✓ سهل التطبيق
                        </span>
                      )}
                      {product.features?.highQuality && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          ⭐ جودة عالية
                        </span>
                      )}
                      {product.features?.tenYearWarranty && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                          🛡️ ضمان 10 سنوات
                        </span>
                      )}
                      {product.features?.weatherResistant && (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                          🌤️ مقاوم للطقس
                        </span>
                      )}
                      {product.features?.waterproof && (
                        <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">
                          💧 مقاوم للماء
                        </span>
                      )}
                      {product.features?.ecoFriendly && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          🌱 صديق للبيئة
                        </span>
                      )}
                      {product.features?.fastDrying && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          ⚡ جفاف سريع
                        </span>
                      )}
                      {product.features?.new && (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                          🆕 جديد
                        </span>
                      )}
                      {product.specifications?.color && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {product.specifications.color}
                        </span>
                      )}
                      {product.specifications?.finish && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {product.specifications.finish}
                        </span>
                      )}
                    </div>

                    {/* Custom Features */}
                    {product.customFeatures && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 font-medium">
                          {product.customFeatures}
                        </p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-red-600">
                          {product.price} د.ل
                        </div>
                        <div className="text-sm text-gray-500">السعر</div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        <span className="hidden sm:inline">أضف للسلة</span>
                        <span className="sm:hidden">أضف</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
