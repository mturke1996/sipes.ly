import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Save, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  productsService,
  categoriesService,
} from "../../services/databaseService";
import { imageUploadService } from "../../services/imageUploadService";
import { Product, Category, ImgBBResponse } from "../../types/database";
import ImageUpload from "../../components/ImageUpload";

export default function ItemsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: 0,
    category: "",
    categoryId: "",
    images: [] as string[],
    stock: 0,
    isActive: true,
    specifications: {
      color: "",
      coverage: "",
      dryingTime: "",
      application: "",
      finish: "",
    },
    features: {
      easyToApply: false,
      highQuality: false,
      tenYearWarranty: false,
      weatherResistant: false,
      waterproof: false,
      ecoFriendly: false,
      fastDrying: false,
      new: false,
    },
    customFeatures: "",
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImgBBResponse[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (response: ImgBBResponse) => {
    setUploadedImages((prev) => [...prev, response]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, response.data.url],
    }));
  };

  const handleImageRemoved = (index?: number) => {
    if (index !== undefined) {
      // حذف صورة محددة
      const imageToRemove = uploadedImages[index];
      if (imageToRemove?.data?.delete_url) {
        imageUploadService.deleteImage(imageToRemove.data.delete_url);
      }

      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      // حذف جميع الصور
      uploadedImages.forEach((image) => {
        if (image?.data?.delete_url) {
          imageUploadService.deleteImage(image.data.delete_url);
        }
      });

      setUploadedImages([]);
      setFormData((prev) => ({
        ...prev,
        images: [],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (!formData.name.trim()) {
      toast.error("اسم المنتج مطلوب");
      return;
    }

    if (!formData.nameAr.trim()) {
      toast.error("اسم المنتج بالعربية مطلوب");
      return;
    }

    if (formData.price <= 0) {
      toast.error("السعر يجب أن يكون أكبر من صفر");
      return;
    }

    if (!formData.categoryId) {
      toast.error("يجب اختيار فئة للمنتج");
      return;
    }

    try {
      if (editingProduct) {
        await productsService.update(editingProduct.id, formData);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await productsService.create(formData);
        toast.success("تم إضافة المنتج بنجاح");
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("فشل في حفظ المنتج");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameAr: product.nameAr,
      description: product.description,
      descriptionAr: product.descriptionAr,
      price: product.price,
      category: product.category,
      categoryId: product.categoryId,
      images: product.images || [],
      stock: product.stock,
      isActive: product.isActive,
      specifications: {
        color: product.specifications?.color || "",
        coverage: product.specifications?.coverage || "",
        dryingTime: product.specifications?.dryingTime || "",
        application: product.specifications?.application || "",
        finish: product.specifications?.finish || "",
      },
      features: {
        easyToApply: product.features?.easyToApply || false,
        highQuality: product.features?.highQuality || false,
        tenYearWarranty: product.features?.tenYearWarranty || false,
        weatherResistant: product.features?.weatherResistant || false,
        waterproof: product.features?.waterproof || false,
        ecoFriendly: product.features?.ecoFriendly || false,
        fastDrying: product.features?.fastDrying || false,
        new: product.features?.new || false,
      },
      customFeatures: product.customFeatures || "",
    });
    setUploadedImages([]); // إعادة تعيين الصور المرفوعة
    setShowAdvancedOptions(true); // إظهار الخيارات المتقدمة عند التعديل
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("هل تريد حذف هذا المنتج؟")) {
      try {
        await productsService.delete(id);
        toast.success("تم حذف المنتج");
        loadData();
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("فشل في حذف المنتج");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: 0,
      category: "",
      categoryId: "",
      images: [],
      stock: 0,
      isActive: true,
      specifications: {
        color: "",
        coverage: "",
        dryingTime: "",
        application: "",
        finish: "",
      },
      features: {
        easyToApply: false,
        highQuality: false,
        tenYearWarranty: false,
        weatherResistant: false,
        waterproof: false,
        ecoFriendly: false,
        fastDrying: false,
        new: false,
      },
      customFeatures: "",
    });
    setUploadedImages([]);
    setShowAdvancedOptions(false);
  };

  const generateRandomProducts = async () => {
    const randomProducts = [
      {
        name: "Interior Premium Paint",
        nameAr: "طلاء داخلي بريميوم",
        description: "High-quality interior paint for long-lasting beauty",
        descriptionAr: "طلاء داخلي عالي الجودة لعمر طويل وجمال دائم",
        price: 45,
        category: "Interior",
        categoryId: "interior",
        images: [],
        stock: 50,
        isActive: true,
        specifications: {
          color: "Multiple Colors",
          coverage: "12 متر مربع/لتر",
          dryingTime: "2-4 ساعات",
          application: "فرشاة أو رولر",
          finish: "ناعم ناعم",
        },
      },
      {
        name: "Exterior Weather Shield",
        nameAr: "طلاء خارجي وايذر شيلد",
        description: "Weather-resistant exterior paint for all climates",
        descriptionAr: "طلاء خارجي مقاوم للطقس لجميع المناخات",
        price: 65,
        category: "Exterior",
        categoryId: "exterior",
        images: [],
        stock: 30,
        isActive: true,
        specifications: {
          color: "Multiple Colors",
          coverage: "10 متر مربع/لتر",
          dryingTime: "4-6 ساعات",
          application: "فرشاة أو رولر",
          finish: "ناعم براق",
        },
      },
      {
        name: "Wood Care Finish",
        nameAr: "طلاء خشب فاين",
        description: "Premium wood finish for protection and beauty",
        descriptionAr: "طلاء خشب فاخر للحماية والجمال",
        price: 55,
        category: "Wood Care",
        categoryId: "wood",
        images: [],
        stock: 40,
        isActive: true,
        specifications: {
          color: "Multiple Colors",
          coverage: "14 متر مربع/لتر",
          dryingTime: "3-5 ساعات",
          application: "فرشاة",
          finish: "لمعان طبيعي",
        },
      },
      {
        name: "Acrylic Gloss Paint",
        nameAr: "طلاء أكريليك جلوس",
        description: "Durable acrylic gloss paint for interior walls",
        descriptionAr: "طلاء أكريليك جلوس متين للجدران الداخلية",
        price: 50,
        category: "Interior",
        categoryId: "interior",
        images: [],
        stock: 35,
        isActive: true,
        specifications: {
          color: "Multiple Colors",
          coverage: "11 متر مربع/لتر",
          dryingTime: "2-3 ساعات",
          application: "فرشاة أو رولر",
          finish: "لمعان عالي",
        },
      },
      {
        name: "Matte Finish Paint",
        nameAr: "طلاء مات فاين",
        description: "Elegant matte finish for modern interiors",
        descriptionAr: "طلاء مات أنيق للديكورات الداخلية الحديثة",
        price: 48,
        category: "Interior",
        categoryId: "interior",
        images: [],
        stock: 45,
        isActive: true,
        specifications: {
          color: "Multiple Colors",
          coverage: "13 متر مربع/لتر",
          dryingTime: "2-4 ساعات",
          application: "فرشاة أو رولر",
          finish: "ماتي ناعم",
        },
      },
    ];

    try {
      setLoading(true);
      for (const product of randomProducts) {
        await productsService.create(product);
      }
      toast.success("تم إضافة المنتجات العشوائية بنجاح!");
      loadData();
    } catch (error) {
      console.error("Failed to generate random products:", error);
      toast.error("فشل في إضافة المنتجات العشوائية");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameAr.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          إدارة المنتجات
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={generateRandomProducts}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition text-sm sm:text-base"
          >
            <Sparkles size={18} />
            <span className="hidden sm:inline">إضافة منتجات تجريبية</span>
            <span className="sm:hidden">منتجات تجريبية</span>
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingProduct(null);
              resetForm();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm sm:text-base"
          >
            <Plus size={18} />
            منتج جديد
          </button>
        </div>
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
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  اسم المنتج (إنجليزي)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  اسم المنتج (عربي)
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  السعر (د.ل)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  الكمية في المخزون
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  الفئة
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => {
                    const selectedCategory = categories.find(
                      (cat) => cat.id === e.target.value
                    );
                    setFormData({
                      ...formData,
                      categoryId: e.target.value,
                      category: selectedCategory?.nameAr || "",
                    });
                  }}
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  الحالة
                </label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "active",
                    })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                المميزات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.easyToApply}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          easyToApply: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">سهل التطبيق</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.highQuality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          highQuality: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">جودة عالية</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.tenYearWarranty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          tenYearWarranty: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">
                    ضمان 10 سنوات
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.weatherResistant}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          weatherResistant: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">مقاوم للطقس</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.waterproof}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          waterproof: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">مقاوم للماء</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.ecoFriendly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          ecoFriendly: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">صديق للبيئة</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.fastDrying}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          fastDrying: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">جفاف سريع</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.new}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          new: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">جديد</span>
                </label>
              </div>

              {/* Custom Features Input */}
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  مميزات إضافية (مخصصة){" "}
                  <span className="text-gray-400 text-xs">(اختياري)</span>
                </label>
                <textarea
                  value={formData.customFeatures}
                  onChange={(e) =>
                    setFormData({ ...formData, customFeatures: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                  rows={3}
                  placeholder="اكتب أي مميزات إضافية للمنتج..."
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="md:col-span-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition text-sm font-medium"
              >
                <span>
                  {showAdvancedOptions ? "إخفاء" : "إظهار"} الخيارات الإضافية
                </span>
                <span className="text-lg">
                  {showAdvancedOptions ? "▲" : "▼"}
                </span>
              </button>
            </div>

            {/* Advanced Options */}
            {showAdvancedOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:col-span-2 space-y-3 sm:space-y-4 bg-gray-50 p-3 sm:p-4 rounded-lg"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  الخيارات الإضافية
                </h3>

                {/* Description */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    الوصف (عربي){" "}
                    <span className="text-gray-400 text-xs">(اختياري)</span>
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionAr: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                    rows={3}
                    placeholder="وصف المنتج باللغة العربية..."
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    صور المنتج{" "}
                    <span className="text-gray-400 text-xs">(اختياري)</span>
                  </label>
                  <ImageUpload
                    onImageUploaded={handleImageUpload}
                    onImageRemoved={handleImageRemoved}
                    maxFiles={5}
                    maxSize={5}
                    existingImages={formData.images}
                    className="border rounded-lg p-3 sm:p-4"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      اللون{" "}
                      <span className="text-gray-400 text-xs">(اختياري)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.color}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      placeholder="مثال: أبيض، أحمر، أزرق..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      التغطية{" "}
                      <span className="text-gray-400 text-xs">(اختياري)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.coverage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            coverage: e.target.value,
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      placeholder="مثال: 10 متر مربع لكل لتر"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      وقت التجفيف{" "}
                      <span className="text-gray-400 text-xs">(اختياري)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.dryingTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            dryingTime: e.target.value,
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      placeholder="مثال: 2-4 ساعات"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      طريقة التطبيق{" "}
                      <span className="text-gray-400 text-xs">(اختياري)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.application}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            application: e.target.value,
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      placeholder="مثال: فرشاة، رولر، بخاخ"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      نوع اللمسة النهائية{" "}
                      <span className="text-gray-400 text-xs">(اختياري)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.finish}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            finish: e.target.value,
                          },
                        })
                      }
                      className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
                      placeholder="مثال: لامع، مطفأ، نصف لامع"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-green-600 text-white px-6 py-2.5 sm:py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Save size={18} />
                {editingProduct ? "تحديث" : "حفظ"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="flex-1 sm:flex-none bg-gray-600 text-white px-6 py-2.5 sm:py-2 rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
              >
                إلغاء
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Products Cards View - Mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  {product.nameAr}
                </h3>
                <p className="text-sm text-gray-500">{product.name}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  product.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.isActive ? "نشط" : "غير نشط"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">السعر</p>
                <p className="text-lg font-bold text-blue-600">
                  {product.price.toLocaleString()} د.ل
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">المخزون</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.stock <= 10
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {product.stock} وحدة
                </span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">الفئة</p>
              <p className="text-sm font-medium text-gray-700">
                {product.category}
              </p>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              >
                <Edit2 size={16} />
                تعديل
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
              >
                <Trash2 size={16} />
                حذف
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Products Table View - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold">
                  اسم المنتج
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold">
                  السعر
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold">
                  الفئة
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold">
                  المخزون
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold">
                  الحالة
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 lg:px-6 py-4">
                    <div>
                      <p className="font-medium text-sm">{product.nameAr}</p>
                      <p className="text-xs text-gray-500">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-blue-600 font-bold text-sm">
                    {product.price.toLocaleString()} د.ل
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm">
                    {product.category}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.stock <= 10
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock} وحدة
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                        title="تعديل"
                      >
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                        title="حذف"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد منتجات مطابقة للبحث
        </div>
      )}
    </div>
  );
}
