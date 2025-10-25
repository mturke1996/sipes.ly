import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { categoriesService } from "../../services/databaseService";
import { Category } from "../../types/database";

export default function CategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    isActive: true,
    image: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoriesService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("فشل في تحميل الفئات");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData);
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        await categoriesService.create(formData);
        toast.success("تم إضافة الفئة بنجاح");
      }

      setShowForm(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("فشل في حفظ الفئة");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameAr: category.nameAr,
      description: category.description,
      descriptionAr: category.descriptionAr,
      isActive: category.isActive,
      image: category.image || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("هل تريد حذف هذه الفئة؟")) {
      try {
        await categoriesService.delete(id);
        toast.success("تم حذف الفئة");
        loadCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("فشل في حذف الفئة");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      isActive: true,
      image: "",
    });
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nameAr.includes(searchTerm) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          إدارة الفئات
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCategory(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          فئة جديدة
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن فئة..."
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
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCategory(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الفئة (إنجليزي)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الفئة (عربي)
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف (عربي)
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAr: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط الصورة
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                فئة نشطة
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Save size={18} />
                {editingCategory ? "تحديث" : "حفظ"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  resetForm();
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                إلغاء
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {category.image && (
              <div className="h-48 bg-gray-200">
                <img
                  src={category.image}
                  alt={category.nameAr}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.nameAr}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    category.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {category.isActive ? "نشط" : "غير نشط"}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-2">{category.name}</p>

              {category.descriptionAr && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.descriptionAr}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                >
                  <Edit2 size={16} />
                  تعديل
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد فئات مطابقة للبحث
        </div>
      )}
    </div>
  );
}
