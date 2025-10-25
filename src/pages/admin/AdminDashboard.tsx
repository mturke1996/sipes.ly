import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import DashboardHome from "./DashboardHome";
import ItemsManagement from "./ItemsManagement";
import CategoriesManagement from "./CategoriesManagement";
import OrdersManagement from "./OrdersManagement";
import CustomersManagement from "./CustomersManagement";
import ReviewsManagement from "./ReviewsManagement";
import MessagesManagement from "./MessagesManagement";
import SettingsManagement from "./SettingsManagement";
import TelegramSettings from "./TelegramSettings";
import ImageSettings from "./ImageSettings";
import SystemTest from "./SystemTest";
import Sidebar from "./Sidebar";
import SipesLogo from "../../components/SipesLogo";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <SipesLogo size="sm" showText={true} textColor="red" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 hidden sm:block">
                لوحة التحكم
              </h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
              title="العودة للموقع الأساسي"
            >
              <Home size={18} className="sm:size-5" />
              <span className="hidden sm:inline font-semibold">الموقع</span>
            </button>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/products" element={<ItemsManagement />} />
              <Route path="/categories" element={<CategoriesManagement />} />
              <Route path="/orders" element={<OrdersManagement />} />
              <Route path="/customers" element={<CustomersManagement />} />
              <Route path="/reviews" element={<ReviewsManagement />} />
              <Route path="/messages" element={<MessagesManagement />} />
              <Route path="/telegram" element={<TelegramSettings />} />
              <Route path="/images" element={<ImageSettings />} />
              <Route path="/test" element={<SystemTest />} />
              <Route path="/settings" element={<SettingsManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
