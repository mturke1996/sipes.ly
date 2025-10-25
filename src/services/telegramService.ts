import { TelegramSettings } from "../types/database";

export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown";
  replyMarkup?: {
    inline_keyboard?: Array<
      Array<{
        text: string;
        url?: string;
        callback_data?: string;
      }>
    >;
  };
}

export interface TelegramNotification {
  type: "newOrder" | "orderUpdate" | "lowStock" | "dailyReport";
  data: any;
}

class TelegramService {
  private botToken: string = "";
  private chatId: string = "";
  private isEnabled: boolean = false;

  constructor() {
    this.loadSettings();
  }

  // Load Telegram settings from localStorage or database
  private loadSettings() {
    const settings = localStorage.getItem("telegramSettings");
    if (settings) {
      const parsed = JSON.parse(settings);
      this.botToken = parsed.botToken || "";
      this.chatId = parsed.chatId || "";
      this.isEnabled = parsed.isEnabled || false;
    }
  }

  // Save Telegram settings
  async saveSettings(settings: TelegramSettings): Promise<void> {
    this.botToken = settings.botToken;
    this.chatId = settings.chatId;
    this.isEnabled = settings.isEnabled;

    localStorage.setItem("telegramSettings", JSON.stringify(settings));
  }

  // Get current settings
  getSettings(): TelegramSettings {
    return {
      botToken: this.botToken,
      chatId: this.chatId,
      isEnabled: this.isEnabled,
      notifications: {
        newOrder: true,
        orderUpdate: true,
        lowStock: true,
        dailyReport: true,
      },
    };
  }

  // Send message to Telegram
  async sendMessage(message: TelegramMessage): Promise<boolean> {
    if (!this.isEnabled || !this.botToken || !this.chatId) {
      console.warn("Telegram service is not configured");
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: message.chatId,
          text: message.text,
          parse_mode: message.parseMode || "HTML",
          reply_markup: message.replyMarkup,
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
      return false;
    }
  }

  // Send cart notification to Telegram
  async sendCartNotification(cartData: any): Promise<boolean> {
    if (!this.isEnabled || !this.botToken || !this.chatId) {
      console.warn("Telegram notifications are disabled or not configured");
      return false;
    }

    try {
      const message = this.formatCartMessage(cartData);

      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: message,
            parse_mode: "HTML",
          }),
        }
      );

      if (response.ok) {
        console.log("Cart notification sent successfully");
        return true;
      } else {
        const errorData = await response.json();
        console.error("Failed to send cart notification:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Error sending cart notification:", error);
      return false;
    }
  }

  // Send notification based on type
  async sendNotification(notification: TelegramNotification): Promise<boolean> {
    if (!this.isEnabled) return false;

    let message = "";
    let parseMode: "HTML" | "Markdown" = "HTML";

    switch (notification.type) {
      case "newOrder":
        message = this.formatNewOrderMessage(notification.data);
        break;
      case "orderUpdate":
        message = this.formatOrderUpdateMessage(notification.data);
        break;
      case "lowStock":
        message = this.formatLowStockMessage(notification.data);
        break;
      case "dailyReport":
        message = this.formatDailyReportMessage(notification.data);
        break;
      default:
        return false;
    }

    return await this.sendMessage({
      chatId: this.chatId,
      text: message,
      parseMode,
    });
  }

  // Format new order message
  private formatNewOrderMessage(order: any): string {
    return `
🆕 <b>طلب جديد - سايبس ليبيا</b>

📋 <b>رقم الطلب:</b> #${order.id}
👤 <b>العميل:</b> ${order.customer?.name || "غير محدد"}
📞 <b>الهاتف:</b> ${order.customer?.phone || "غير محدد"}
💰 <b>المبلغ الإجمالي:</b> ${order.totalAmount} د.ل

📦 <b>المنتجات:</b>
${
  order.items
    ?.map(
      (item: any) =>
        `• ${item.product?.nameAr || item.product?.name} - الكمية: ${
          item.quantity
        }`
    )
    .join("\n") || "لا توجد منتجات"
}

📍 <b>عنوان التسليم:</b>
${order.shippingAddress}

⏰ <b>وقت الطلب:</b> ${new Date(order.createdAt).toLocaleString("ar-LY")}
    `.trim();
  }

  // Format order update message
  private formatOrderUpdateMessage(order: any): string {
    const statusEmoji = {
      pending: "⏳",
      confirmed: "✅",
      processing: "🔄",
      shipped: "🚚",
      delivered: "🎉",
      cancelled: "❌",
    };

    return `
📝 <b>تحديث حالة الطلب - سايبس ليبيا</b>

📋 <b>رقم الطلب:</b> #${order.id}
${
  statusEmoji[order.status as keyof typeof statusEmoji]
} <b>الحالة الجديدة:</b> ${this.getStatusText(order.status)}

👤 <b>العميل:</b> ${order.customer?.name || "غير محدد"}
💰 <b>المبلغ الإجمالي:</b> ${order.totalAmount} د.ل

⏰ <b>وقت التحديث:</b> ${new Date().toLocaleString("ar-LY")}
    `.trim();
  }

  // Format low stock message
  private formatLowStockMessage(products: any[]): string {
    return `
⚠️ <b>تحذير: مخزون منخفض - سايبس ليبيا</b>

المنتجات التالية تحتاج إلى إعادة تخزين:

${products
  .map(
    (product) =>
      `📦 <b>${product.nameAr || product.name}</b>
   الكمية المتبقية: ${product.stock} وحدة
   الحد الأدنى: 10 وحدة`
  )
  .join("\n\n")}

⏰ <b>وقت التحذير:</b> ${new Date().toLocaleString("ar-LY")}
    `.trim();
  }

  // Format daily report message
  private formatDailyReportMessage(stats: any): string {
    return `
📊 <b>التقرير اليومي - سايبس ليبيا</b>

📅 <b>التاريخ:</b> ${new Date().toLocaleDateString("ar-LY")}

📈 <b>الإحصائيات:</b>
• إجمالي المنتجات: ${stats.totalProducts}
• إجمالي الطلبات: ${stats.totalOrders}
• إجمالي العملاء: ${stats.totalCustomers}
• إجمالي الإيرادات: ${stats.totalRevenue} د.ل
• الطلبات المعلقة: ${stats.pendingOrders}
• منتجات المخزون المنخفض: ${stats.lowStockProducts}

💰 <b>إيرادات الشهر:</b> ${stats.monthlyRevenue} د.ل
📦 <b>طلبات الأسبوع:</b> ${stats.weeklyOrders}

⏰ <b>وقت التقرير:</b> ${new Date().toLocaleString("ar-LY")}
    `.trim();
  }

  // Get status text in Arabic
  private getStatusText(status: string): string {
    const statusMap = {
      pending: "في الانتظار",
      confirmed: "مؤكد",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  // Format cart message
  private formatCartMessage(cartData: any): string {
    const { items, total, customerInfo } = cartData;

    const cartItemsText = items
      .map(
        (item: any) =>
          `• ${item.name} × ${item.quantity} = ${
            item.price * item.quantity
          } د.ل`
      )
      .join("\n");

    let message = `🛒 <b>طلب جديد من السلة</b>

👤 <b>الاسم:</b> ${customerInfo?.name || "غير محدد"}
📞 <b>رقم الهاتف:</b> ${customerInfo?.phone || "غير محدد"}
📍 <b>العنوان:</b> ${customerInfo?.address || "غير محدد"}
${
  customerInfo?.email
    ? `📧 <b>البريد الإلكتروني:</b> ${customerInfo.email}`
    : ""
}

🛍️ <b>المنتجات:</b>
${cartItemsText}

💰 <b>المجموع الكلي:</b> ${total} د.ل
${customerInfo?.notes ? `\n💬 <b>ملاحظات:</b>\n${customerInfo.notes}` : ""}

⏰ <b>وقت الطلب:</b> ${new Date().toLocaleString("ar-LY")}`;

    return message.trim();
  }

  // Test Telegram connection
  async testConnection(): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/getMe`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.ok) {
        // Send test message
        await this.sendMessage({
          chatId: this.chatId,
          text: "✅ تم ربط Telegram بنجاح مع سايبس ليبيا!\n\nيمكنك الآن تلقي الإشعارات والإحصائيات.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Telegram connection test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
const telegramService = new TelegramService();
export { telegramService };
