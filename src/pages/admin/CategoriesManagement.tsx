import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'داخلي', description: 'دهانات الجدران الداخلية' },
    { id: 2, name: 'خارجي', description: 'دهانات الأسطح الخارجية' },
    { id: 3, name: 'متخصص', description: 'دهانات ومعالجات متخصصة' },
  ]);

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success('تم حذف الفئة');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">إدارة الفئات</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} />
          فئة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2">
                <Edit2 size={18} />
                تعديل
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                حذف
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
