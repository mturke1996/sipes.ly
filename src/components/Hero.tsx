import { motion } from "framer-motion";
import { ChevronDown, ShoppingCart, Palette } from "lucide-react";
import SipesLogo from "./SipesLogo";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8 text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center mb-4"
          >
            <SipesLogo
              size="xl"
              showText={true}
              textColor="white"
              vertical={true}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2"
          >
            للدهانات والطلاء
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-semibold mb-3 sm:mb-4"
          >
            داخلي • خارجي • رعاية الخشب
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mb-4 sm:mb-6 md:mb-8 px-4"
          >
            حلول شاملة للدهانات الداخلية والخارجية ورعاية الخشب
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            للمهندسين والمصممين والحرفيين
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col gap-4 w-full max-w-md px-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/products")}
              className="w-full bg-white text-red-600 px-6 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 transition shadow-2xl hover:shadow-red-500/25 flex items-center justify-center gap-3"
            >
              <Palette size={24} />
              تصفح المنتجات
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/contact")}
              className="w-full border-2 border-white text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition backdrop-blur-sm flex items-center justify-center gap-3"
            >
              <ShoppingCart size={24} />
              اتصل بنا
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="w-full pt-8 border-t border-white/20 px-4"
          >
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-center">
              <div className="text-center flex-1">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  داخلي
                </div>
                <div className="text-white/70 text-xs sm:text-sm font-semibold">
                  دهانات داخلية
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  خارجي
                </div>
                <div className="text-white/70 text-xs sm:text-sm font-semibold">
                  حماية من الطقس
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  خشب
                </div>
                <div className="text-white/70 text-xs sm:text-sm font-semibold">
                  رعاية الخشب
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown size={32} className="text-white/80" />
      </motion.div>
    </div>
  );
}
