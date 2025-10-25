import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  LogIn,
  Award,
  Star,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import SipesLogo from "./SipesLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xl border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo with SIPES Branding */}
          <Link to="/" className="flex items-center">
            <SipesLogo size="lg" showText={true} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              الرئيسية
            </Link>
            <a
              href="#products"
              className="text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              المنتجات
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              من نحن
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              اتصل بنا
            </a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-red-50 rounded-xl transition group"
            >
              <ShoppingCart
                size={24}
                className="text-gray-700 group-hover:text-red-600"
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Admin or Login */}
            {user && user.role === "admin" ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition font-semibold text-sm shadow-lg hover:shadow-red-500/25"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-xl transition group"
                  title="تسجيل الخروج"
                >
                  <LogOut
                    size={20}
                    className="text-gray-700 group-hover:text-red-600"
                  />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 hover:bg-red-50 rounded-xl transition group"
                title="تسجيل الدخول"
              >
                <LogIn
                  size={20}
                  className="text-gray-700 group-hover:text-red-600"
                />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-red-50 rounded-xl transition"
            >
              {isOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-6 pb-4 border-t border-red-100 pt-6 space-y-4">
            <Link
              to="/"
              className="block py-3 text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              الرئيسية
            </Link>
            <a
              href="#products"
              className="block py-3 text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              المنتجات
            </a>
            <a
              href="#about"
              className="block py-3 text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              من نحن
            </a>
            <a
              href="#contact"
              className="block py-3 text-gray-700 hover:text-red-600 transition font-semibold text-base"
            >
              اتصل بنا
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
