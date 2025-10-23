# 📋 دليل التثبيت والإعداد

## الخطوة 1: المتطلبات

تأكد من تثبيت ما يلي:
- **Node.js** (الإصدار 18 أو أحدث)
- **npm** أو **yarn**
- **Git**

## الخطوة 2: استنساخ المشروع

```bash
cd C:\Users\mohtu\OneDrive\Desktop
git clone https://github.com/yourusername/saibes-libya.git
cd Saibes-Libya-Paint
```

## الخطوة 3: تثبيت الحزم

```bash
npm install
```

## الخطوة 4: إنشاء ملف البيئة

```bash
# نسخ ملف المثال
cp env.example .env.local

# أو على Windows
copy env.example .env.local
```

## الخطوة 5: إعداد Firebase

### أ) إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. انقر على "Create Project"
3. أدخل اسم المشروع: `saibes-libya`
4. اتبع الخطوات

### ب) الحصول على بيانات الاتصال

1. في لوحة Firebase، اذهب إلى Settings (الترس)
2. اختر "Project Settings"
3. انسخ الأرقام من قسم "firebaseConfig"
4. أضفها في `.env.local`

### ج) تفعيل المصادقة

1. في Firebase Console، اذهب إلى "Authentication"
2. اختر "Email/Password" من Sign-in method
3. فعّله

### د) إنشاء حساب Admin

```bash
# استخدم Firebase Console أو برنامج مثل Firebase CLI
firebase auth:import
```

أو أنشئ حسابًا يدويًا:
- البريد: `admin@saibes.com`
- كلمة المرور: `admin123`

## الخطوة 6: التشغيل

```bash
npm run dev
```

سيتم فتح الموقع تلقائيًا على `http://localhost:5173`

## الخطوة 7: الوصول

- **الموقع**: http://localhost:5173
- **لوحة التحكم**: http://localhost:5173/admin
- **تسجيل الدخول**: admin@saibes.com / admin123

## الخطوة 8: البناء والنشر

### البناء

```bash
npm run build
```

سيتم إنشاء مجلد `dist` يحتوي على الملفات الجاهزة للنشر

### النشر

#### على Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### على Vercel

```bash
npm install -g vercel
vercel --prod
```

#### على Firebase Hosting

```bash
firebase deploy --only hosting
```

## 🐛 حل المشاكل الشائعة

### المشكلة: "Cannot find module 'react'"
**الحل:**
```bash
npm install
```

### المشكلة: Firebase errors
**الحل:**
- تحقق من متغيرات `.env.local`
- تأكد من تفعيل Firebase Authentication
- تحقق من قواعد Firestore

### المشكلة: Port 5173 مستخدم
**الحل:**
```bash
npm run dev -- --port 3000
```

## 📚 مراجع مفيدة

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

## ✅ Checklist قبل النشر

- [ ] تحديث معلومات المتجر
- [ ] تغيير كلمات المرور الافتراضية
- [ ] اختبار جميع الصفحات
- [ ] اختبار لوحة التحكم
- [ ] تحديث سياسة الخصوصية
- [ ] تحديث سياسة الشروط والأحكام

## 📞 الدعم

للمساعدة، تواصل عبر:
- البريد: info@saibes-libya.com
- الهاتف: +218 21 111 2222

---

Made with ❤️ in Libya 🇱🇾
