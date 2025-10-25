import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsManagement() {
  const [settings, setSettings] = useState({
    storeName: "سايبس ليبيا",
    email: "info@saibes-libya.com",
    phone: "+218 21 111 2222",
    address: "طرابلس، ليبيا",
    freeShippingThreshold: 150000,
    taxRate: 0,
  });

  const handleSave = () => {
    toast.success("تم حفظ الإعدادات");
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">الإعدادات</h1>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">اسم المتجر</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) =>
                setSettings({ ...settings, storeName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">العنوان</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              حد التوصيل المجاني
            </label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  freeShippingThreshold: parseInt(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              نسبة الضريبة (%)
            </label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) =>
                setSettings({ ...settings, taxRate: parseInt(e.target.value) })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Save size={20} />
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}
