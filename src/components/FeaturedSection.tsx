import { motion } from "framer-motion";
import { Palette, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full mb-6 text-sm sm:text-base font-bold shadow-lg"
          >
            <Palette size={18} />
            مميزة وموثوقة من سايبس
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            المنتجات المميزة
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            منتجات عالية الجودة من قاعدة البيانات
          </p>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Palette size={20} />
            عرض جميع المنتجات
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
