import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Settings,
  MessageSquare,
  Users,
  Image,
  TestTube,
  Star,
  Mail,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "الرئيسية", icon: LayoutDashboard },
    { path: "/admin/products", label: "المنتجات", icon: Package },
    { path: "/admin/categories", label: "الفئات", icon: Tag },
    { path: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
    { path: "/admin/customers", label: "العملاء", icon: Users },
    { path: "/admin/reviews", label: "التقيمات", icon: Star },
    { path: "/admin/messages", label: "الرسائل", icon: Mail },
    { path: "/admin/telegram", label: "إعدادات Telegram", icon: MessageSquare },
    { path: "/admin/images", label: "إعدادات الصور", icon: Image },
    { path: "/admin/test", label: "اختبار النظام", icon: TestTube },
    { path: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 right-0 w-64 bg-gray-900 text-white transform transition-transform md:translate-x-0 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 px-4 pt-4 md:pt-6 pb-4">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => onClose()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === path
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
