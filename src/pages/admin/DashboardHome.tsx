import { BarChart3, ShoppingCart, Package, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  const stats = [
    { label: 'إجمالي الطلبات', value: '1,245', icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'المنتجات', value: '87', icon: Package, color: 'bg-green-500' },
    { label: 'العملاء', value: '3,421', icon: Users, color: 'bg-purple-500' },
    { label: 'الإيرادات', value: '45,230 ₪', icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">لوحة التحكم</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4">آخر الطلبات</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b last:pb-0 last:border-b-0">
                <div>
                  <p className="font-bold">طلب رقم #{1001 + i}</p>
                  <p className="text-gray-600 text-sm">محمد علي</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">500 ₪</p>
                  <p className="text-sm text-green-600">مكتمل</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4">أفضل المنتجات</h2>
          <div className="space-y-4">
            {[
              { name: 'دهان الجدران الفاخر', sales: 456 },
              { name: 'طلاء مقاوم الرطوبة', sales: 324 },
              { name: 'دهان مضاد للفطريات', sales: 198 },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b last:pb-0 last:border-b-0">
                <p className="font-bold">{product.name}</p>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {product.sales} بيع
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
