import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import DashboardHome from './DashboardHome';
import ItemsManagement from './ItemsManagement';
import CategoriesManagement from './CategoriesManagement';
import OrdersManagement from './OrdersManagement';
import SettingsManagement from './SettingsManagement';
import Sidebar from './Sidebar';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">سايبس - لوحة التحكم</h1>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/products" element={<ItemsManagement />} />
              <Route path="/categories" element={<CategoriesManagement />} />
              <Route path="/orders" element={<OrdersManagement />} />
              <Route path="/settings" element={<SettingsManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
