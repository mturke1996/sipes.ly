import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ItemsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'دهان الجدران الفاخر', price: 45000, category: 'داخلي', inStock: true },
    { id: 2, name: 'طلاء مقاوم الرطوبة', price: 65000, category: 'خارجي', inStock: true },
    { id: 3, name: 'دهان مضاد للفطريات', price: 75000, category: 'متخصص', inStock: false },
  ]);

  const handleDelete = (id: number) => {
    if (window.confirm('هل تريد حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('تم حذف المنتج');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.includes(searchTerm) || p.category.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">إدارة المنتجات</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          منتج جديد
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">إضافة منتج جديد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="اسم المنتج" className="border rounded-lg px-4 py-2" />
            <input type="number" placeholder="السعر" className="border rounded-lg px-4 py-2" />
            <input type="text" placeholder="الفئة" className="border rounded-lg px-4 py-2" />
            <input type="text" placeholder="الوصف" className="border rounded-lg px-4 py-2" />
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              حفظ
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">اسم المنتج</th>
              <th className="px-6 py-3 text-right">السعر</th>
              <th className="px-6 py-3 text-right">الفئة</th>
              <th className="px-6 py-3 text-right">الحالة</th>
              <th className="px-6 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4 text-blue-600 font-bold">{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.inStock ? 'متاح' : 'غير متاح'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition">
                      <Edit2 size={18} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
