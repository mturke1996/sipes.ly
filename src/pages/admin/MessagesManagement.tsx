import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Trash2, Reply, Archive, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { contactMessagesService } from "../../services/databaseService";
import { ContactMessage } from "../../types/database";

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "new" | "read" | "replied" | "archived"
  >("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data =
        filter === "all"
          ? await contactMessagesService.getAll()
          : await contactMessagesService.getByStatus(filter);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("فشل في تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await contactMessagesService.update(id, { status: status as any });
      toast.success("تم تحديث حالة الرسالة");
      loadMessages();
    } catch (error) {
      toast.error("فشل في تحديث الرسالة");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    try {
      await contactMessagesService.delete(id);
      toast.success("تم حذف الرسالة");
      loadMessages();
    } catch (error) {
      toast.error("فشل في حذف الرسالة");
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error("الرجاء إدخال رد");
      return;
    }

    try {
      await contactMessagesService.addReply(selectedMessage.id, replyText);
      toast.success("تم إرسال الرد");
      setReplyText("");
      setShowReplyForm(false);
      setSelectedMessage(null);
      loadMessages();
    } catch (error) {
      toast.error("فشل في إرسال الرد");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { text: "جديد", color: "bg-blue-100 text-blue-600" },
      read: { text: "مقروء", color: "bg-yellow-100 text-yellow-600" },
      replied: { text: "تم الرد", color: "bg-green-100 text-green-600" },
      archived: { text: "مؤرشف", color: "bg-gray-100 text-gray-600" },
    };
    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.new;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true;
    return msg.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الرسائل</h1>
        <div className="text-sm text-gray-500">
          إجمالي الرسائل: {messages.length}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: "all", label: "الكل" },
          { key: "new", label: "جديد" },
          { key: "read", label: "مقروء" },
          { key: "replied", label: "تم الرد" },
          { key: "archived", label: "مؤرشف" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 font-medium transition ${
              filter === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  معلومات الاتصال
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الرسالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        {message.name}
                      </div>
                      {message.email && (
                        <div className="text-sm text-gray-500">
                          {message.email}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        {message.phone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {message.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {message.message}
                    </div>
                    {message.reply && (
                      <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        <div className="font-medium">الرد:</div>
                        {message.reply}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(message.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString("ar-LY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {message.status === "new" && (
                        <button
                          onClick={() => handleStatusChange(message.id, "read")}
                          className="text-blue-600 hover:text-blue-900"
                          title="تحديد كمقروء"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowReplyForm(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="رد"
                      >
                        <Reply size={18} />
                      </button>
                      {message.status !== "archived" && (
                        <button
                          onClick={() =>
                            handleStatusChange(message.id, "archived")
                          }
                          className="text-gray-600 hover:text-gray-900"
                          title="أرشفة"
                        >
                          <Archive size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyForm && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">إرسال رد</h2>
            <div className="mb-4 space-y-2">
              <div className="text-sm text-gray-600">الرسالة:</div>
              <div className="bg-gray-50 p-3 rounded">
                {selectedMessage.message}
              </div>
              <div className="text-sm text-gray-600">
                المرسل: {selectedMessage.name}
              </div>
              <div className="text-sm text-gray-600">
                الهاتف: {selectedMessage.phone}
              </div>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              placeholder="اكتب ردك هنا..."
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleReply}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                إرسال الرد
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setSelectedMessage(null);
                  setReplyText("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
