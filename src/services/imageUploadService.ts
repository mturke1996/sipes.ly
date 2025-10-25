import { ImgBBResponse } from "../types/database";

export interface ImageUploadOptions {
  file: File;
  name?: string;
  expiration?: number; // in seconds, 60-15552000
}

class ImageUploadService {
  private apiKey: string = "2ba5baf77d802151c6931dea841d6abe";
  private baseUrl: string = "https://api.imgbb.com/1/upload";

  constructor() {
    // يمكن تحميل API key من متغيرات البيئة
    this.apiKey = import.meta.env.VITE_IMGBB_API_KEY || this.apiKey;
  }

  // طريقة عامة لتحديث API Key
  setApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
  }

  /**
   * رفع صورة واحدة إلى ImgBB
   */
  async uploadImage(options: ImageUploadOptions): Promise<ImgBBResponse> {
    try {
      const formData = new FormData();
      formData.append("key", this.apiKey);
      formData.append("image", options.file);

      if (options.name) {
        formData.append("name", options.name);
      }

      if (options.expiration) {
        formData.append("expiration", options.expiration.toString());
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "فشل في رفع الصورة");
      }

      return result;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error(
        "فشل في رفع الصورة. تحقق من اتصال الإنترنت وحاول مرة أخرى."
      );
    }
  }

  /**
   * رفع عدة صور
   */
  async uploadMultipleImages(files: File[]): Promise<ImgBBResponse[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage({ file }));

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Multiple images upload failed:", error);
      throw new Error(
        "فشل في رفع الصور. تحقق من اتصال الإنترنت وحاول مرة أخرى."
      );
    }
  }

  /**
   * رفع صورة من URL
   */
  async uploadImageFromUrl(
    imageUrl: string,
    name?: string
  ): Promise<ImgBBResponse> {
    try {
      const formData = new FormData();
      formData.append("key", this.apiKey);
      formData.append("image", imageUrl);

      if (name) {
        formData.append("name", name);
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "فشل في رفع الصورة");
      }

      return result;
    } catch (error) {
      console.error("Image URL upload failed:", error);
      throw new Error(
        "فشل في رفع الصورة من الرابط. تحقق من صحة الرابط وحاول مرة أخرى."
      );
    }
  }

  /**
   * تحويل File إلى Base64
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // إزالة "data:image/...;base64," من البداية
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * رفع صورة باستخدام Base64
   */
  async uploadImageFromBase64(
    base64Data: string,
    name?: string
  ): Promise<ImgBBResponse> {
    try {
      const formData = new FormData();
      formData.append("key", this.apiKey);
      formData.append("image", base64Data);

      if (name) {
        formData.append("name", name);
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "فشل في رفع الصورة");
      }

      return result;
    } catch (error) {
      console.error("Base64 image upload failed:", error);
      throw new Error(
        "فشل في رفع الصورة. تحقق من صحة البيانات وحاول مرة أخرى."
      );
    }
  }

  /**
   * حذف صورة (يتطلب delete_url من الاستجابة)
   */
  async deleteImage(deleteUrl: string): Promise<boolean> {
    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      return response.ok;
    } catch (error) {
      console.error("Image deletion failed:", error);
      return false;
    }
  }

  /**
   * التحقق من صحة API Key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      // محاولة رفع صورة صغيرة للاختبار
      const testImage =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      const response = await this.uploadImageFromBase64(testImage, "test");

      // حذف الصورة التجريبية
      if (response?.data?.delete_url) {
        await this.deleteImage(response.data.delete_url);
      }

      return true;
    } catch (error) {
      console.error("API Key validation failed:", error);
      return false;
    }
  }

  /**
   * الحصول على معلومات الصورة
   */
  getImageInfo(response: ImgBBResponse) {
    return {
      id: response.data.id,
      title: response.data.title,
      url: response.data.url,
      displayUrl: response.data.display_url,
      deleteUrl: response.data.delete_url,
      size: response.data.size,
      width: response.data.width,
      height: response.data.height,
      time: response.data.time,
      expiration: response.data.expiration,
    };
  }

  /**
   * إنشاء رابط مصغر للصورة
   */
  getThumbnailUrl(
    response: ImgBBResponse,
    size: "thumb" | "medium" = "thumb"
  ): string {
    if (size === "thumb") {
      return response.data.thumb?.url || response.data.url;
    } else {
      return response.data.medium?.url || response.data.url;
    }
  }
}

// Export singleton instance
export const imageUploadService = new ImageUploadService();
