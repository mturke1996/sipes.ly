import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { telegramService } from "../services/telegramService";
import { contactMessagesService } from "../services/databaseService";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("رقم الهاتف مطلوب");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("الملاحظة مطلوبة");
      return;
    }

    setLoading(true);

    try {
      // Save to Firebase
      const messageId = await contactMessagesService.create({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        address: formData.address,
        message: formData.message,
        status: "new",
        telegramSent: false,
      });

      // Send to Telegram
      const telegramSuccess = await telegramService.sendMessage({
        chatId: telegramService.getSettings().chatId,
        text: `📨 <b>رسالة جديدة من الموقع</b>

👤 <b>الاسم:</b> ${formData.name}
📞 <b>رقم الهاتف:</b> ${formData.phone}
📍 <b>العنوان:</b> ${formData.address}
${formData.email ? `📧 <b>البريد الإلكتروني:</b> ${formData.email}` : ""}

💬 <b>الرسالة:</b>
${formData.message}

⏰ <b>الوقت:</b> ${new Date().toLocaleString("ar-LY")}`,
      });

      // Update telegramSent status
      if (telegramSuccess) {
        await contactMessagesService.update(messageId, { telegramSent: true });
      }

      toast.success("تم إرسال رسالتك بنجاح!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">اتصل بنا</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">الهاتف</h3>
                  <p className="text-gray-600">+218 21 111 2222</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                  <p className="text-gray-600">info@saibes-libya.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">العنوان</h3>
                  <p className="text-gray-600">طرابلس، ليبيا</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold mb-2">
                الاسم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="أدخل اسمك"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                البريد الإلكتروني{" "}
                <span className="text-gray-400 text-xs">(اختياري)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="أدخل رقم هاتفك"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                العنوان <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="أدخل عنوانك"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                الملاحظة <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="أكتب ملاحظتك هنا"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
