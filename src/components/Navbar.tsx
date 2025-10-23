import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut, LogIn } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline text-gray-800">سايبس</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-600 transition">الرئيسية</Link>
            <a href="#products" className="hover:text-blue-600 transition">المنتجات</a>
            <a href="#about" className="hover:text-blue-600 transition">من نحن</a>
            <a href="#contact" className="hover:text-blue-600 transition">اتصل بنا</a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/" className="relative hover:text-blue-600 transition">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Admin or Login */}
            {user && user.role === 'admin' ? (
              <div className="flex items-center gap-2">
                <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm font-medium">لوحة التحكم</Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="تسجيل الدخول"
              >
                <LogIn size={20} />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <Link to="/" className="block py-2 hover:text-blue-600">الرئيسية</Link>
            <a href="#products" className="block py-2 hover:text-blue-600">المنتجات</a>
            <a href="#about" className="block py-2 hover:text-blue-600">من نحن</a>
            <a href="#contact" className="block py-2 hover:text-blue-600">اتصل بنا</a>
          </div>
        )}
      </div>
    </nav>
  );
}
