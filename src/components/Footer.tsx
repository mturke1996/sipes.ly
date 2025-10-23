import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">سايبس ليبيا</h3>
            <p className="text-sm">أفضل أنواع الدهانات والطلاءات عالي الجودة في ليبيا</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-4">الروابط</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="hover:text-white transition">الرئيسية</Link>
              <a href="#products" className="block hover:text-white transition">المنتجات</a>
              <a href="#contact" className="block hover:text-white transition">اتصل بنا</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">قانوني</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block hover:text-white transition">سياسة الخصوصية</a>
              <a href="#" className="block hover:text-white transition">شروط الاستخدام</a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-white mb-4">تابعنا</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 سايبس ليبيا. جميع الحقوق محفوظة. 🇱🇾</p>
        </div>
      </div>
    </footer>
  );
}
