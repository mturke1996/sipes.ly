import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Award,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import SipesLogo from "./SipesLogo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company with SIPES Branding */}
          <div>
            <div className="mb-4">
              <SipesLogo size="md" showText={true} textColor="white" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              أفضل أنواع الدهانات والطلاءات عالي الجودة في ليبيا
            </p>
            <div className="flex items-center gap-2 text-yellow-400">
              <Star size={16} className="fill-yellow-400" />
              <span className="text-sm font-semibold">
                العلامة التجارية الرائدة
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">الروابط</h3>
            <div className="space-y-3 text-sm">
              <Link
                to="/"
                className="block hover:text-red-400 transition font-medium"
              >
                الرئيسية
              </Link>
              <a
                href="#products"
                className="block hover:text-red-400 transition font-medium"
              >
                المنتجات
              </a>
              <a
                href="#about"
                className="block hover:text-red-400 transition font-medium"
              >
                من نحن
              </a>
              <a
                href="#contact"
                className="block hover:text-red-400 transition font-medium"
              >
                اتصل بنا
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">قانوني</h3>
            <div className="space-y-3 text-sm">
              <a
                href="#"
                className="block hover:text-red-400 transition font-medium"
              >
                سياسة الخصوصية
              </a>
              <a
                href="#"
                className="block hover:text-red-400 transition font-medium"
              >
                شروط الاستخدام
              </a>
              <a
                href="#"
                className="block hover:text-red-400 transition font-medium"
              >
                سياسة الإرجاع
              </a>
              <a
                href="#"
                className="block hover:text-red-400 transition font-medium"
              >
                الأسئلة الشائعة
              </a>
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">تابعنا</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="p-3 bg-gray-800 hover:bg-red-600 rounded-xl transition group"
              >
                <Facebook size={20} className="group-hover:text-white" />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-800 hover:bg-red-600 rounded-xl transition group"
              >
                <Twitter size={20} className="group-hover:text-white" />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-800 hover:bg-red-600 rounded-xl transition group"
              >
                <Instagram size={20} className="group-hover:text-white" />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-800 hover:bg-red-600 rounded-xl transition group"
              >
                <Linkedin size={20} className="group-hover:text-white" />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              <p className="mb-2">📞 +218 21 123 4567</p>
              <p className="mb-2">📧 info@sipes.ly</p>
              <p>📍 طرابلس، ليبيا</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2024 SIPES ليبيا. جميع الحقوق محفوظة. 🇱🇾
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award size={16} className="text-red-400" />
              <span>معتمد دوليًا</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
