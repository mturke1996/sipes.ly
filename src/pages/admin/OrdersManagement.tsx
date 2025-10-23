import { useState } from 'react';
import { Eye, Download } from 'lucide-react';

export default function OrdersManagement() {
  const [orders] = useState([
    { id: 1001, customer: 'أحمد محمد', total: 450000, status: 'مكتمل', date: '2024-10-20' },
    { id: 1002, customer: 'فاطمة علي', total: 320000, status: 'قيد المعالجة', date: '2024-10-21' },
    { id: 1003, customer: 'محمود الحسن', total: 580000, status: 'في الشحن', date: '2024-10-22' },
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">إدارة الطلبات</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">رقم الطلب</th>
              <th className="px-6 py-3 text-right">العميل</th>
              <th className="px-6 py-3 text-right">الإجمالي</th>
              <th className="px-6 py-3 text-right">الحالة</th>
              <th className="px-6 py-3 text-right">التاريخ</th>
              <th className="px-6 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold">#{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4 text-blue-600 font-bold">{order.total.toLocaleString()} ₪</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    order.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                    order.status === 'قيد المعالجة' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition">
                      <Eye size={18} className="text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-green-100 rounded-lg transition">
                      <Download size={18} className="text-green-600" />
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
