import { motion } from 'framer-motion';

export default function FeaturedSection() {
  const products = [
    {
      id: 1,
      name: 'دهان الجدران الفاخر',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1578519603510-e3fb19a540d6?w=500&h=500&fit=crop',
      category: 'داخلي',
    },
    {
      id: 2,
      name: 'طلاء مقاوم الرطوبة',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1589939705882-c6cf27e10e5e?w=500&h=500&fit=crop',
      category: 'خارجي',
    },
    {
      id: 3,
      name: 'دهان مضاد للفطريات',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
      category: 'متخصص',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">المنتجات المميزة</h2>
          <p className="text-gray-600 text-lg">أشهر منتجاتنا التي يختارها آلاف العملاء</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition group"
            >
              <div className="relative overflow-hidden h-72">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">منتج عالي الجودة معتمد دوليًا</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                    شراء
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
