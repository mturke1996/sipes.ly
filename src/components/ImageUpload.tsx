import { useState, useRef } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { imageUploadService } from "../services/imageUploadService";
import { ImgBBResponse } from "../types/database";

interface ImageUploadProps {
  onImageUploaded: (response: ImgBBResponse) => void;
  onImageRemoved?: () => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  existingImages?: string[];
  className?: string;
}

interface UploadedImage {
  file: File;
  response: ImgBBResponse;
  preview: string;
}

export default function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  maxFiles = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSize = 5, // 5MB
  existingImages = [],
  className = "",
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // التحقق من عدد الملفات
    if (uploadedImages.length + fileArray.length > maxFiles) {
      toast.error(`يمكنك رفع ${maxFiles} صور كحد أقصى`);
      return;
    }

    // التحقق من نوع وحجم الملفات
    for (const file of fileArray) {
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`نوع الملف ${file.name} غير مدعوم`);
        return;
      }

      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`حجم الملف ${file.name} أكبر من ${maxSize}MB`);
        return;
      }
    }

    setIsUploading(true);

    try {
      for (const file of fileArray) {
        try {
          const response = await imageUploadService.uploadImage({ file });
          const preview = URL.createObjectURL(file);

          const uploadedImage: UploadedImage = {
            file,
            response,
            preview,
          };

          setUploadedImages((prev) => [...prev, uploadedImage]);
          onImageUploaded(response);

          toast.success(`تم رفع ${file.name} بنجاح`);
        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          toast.error(`فشل في رفع ${file.name}`);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("فشل في رفع الصور");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const image = uploadedImages[index];

    try {
      // محاولة حذف الصورة من ImgBB
      if (image?.response?.data?.delete_url) {
        imageUploadService.deleteImage(image.response.data.delete_url);
      }

      // إزالة الصورة من القائمة
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));

      // تحرير الذاكرة
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      onImageRemoved?.(index);
      toast.success("تم حذف الصورة");
    } catch (error) {
      console.error("Failed to remove image:", error);
      toast.error("فشل في حذف الصورة من الخدمة، لكن تم حذفها من القائمة");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="flex justify-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isUploading
                ? "جاري رفع الصور..."
                : "اسحب الصور هنا أو اضغط للاختيار"}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, WEBP, GIF حتى {maxSize}MB لكل صورة
            </p>
            <p className="text-xs text-gray-400">
              يمكنك رفع {maxFiles} صور كحد أقصى
            </p>
          </div>

          <button
            onClick={openFileDialog}
            disabled={isUploading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isUploading ? "جاري الرفع..." : "اختيار الصور"}
          </button>
        </div>
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">الصور الموجودة:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => {
                      // يمكن إضافة منطق حذف الصور الموجودة هنا
                      toast.info("حذف الصور الموجودة غير متاح حالياً");
                    }}
                    className="opacity-0 group-hover:opacity-100 transition p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      <AnimatePresence>
        {uploadedImages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              الصور المرفوعة:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {uploadedImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={image.preview}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />

                  {/* Success indicator */}
                  <div className="absolute top-1 right-1">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </div>

                  {/* Remove button */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => removeImage(index)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded-b-lg">
                    <p className="truncate">{image.file.name}</p>
                    <p>{(image.file.size / 1024 / 1024).toFixed(1)}MB</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">جاري رفع الصور...</span>
        </div>
      )}

      {/* Error Messages */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          • أنواع الملفات المدعومة:{" "}
          {acceptedTypes.map((type) => type.split("/")[1]).join(", ")}
        </p>
        <p>• الحد الأقصى لحجم الملف: {maxSize}MB</p>
        <p>• الحد الأقصى لعدد الصور: {maxFiles}</p>
      </div>
    </div>
  );
}
