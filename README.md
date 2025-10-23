# 🎨 Saibes Libya - Paint & Coating Store

موقع متجر متخصص في بيع الدهانات والطلاءات عالي الجودة مع لوحة تحكم متقدمة.

## ✨ الميزات

- **واجهة جميلة وحديثة** - تصميم عصري مع Tailwind CSS
- **متجر متكامل** - عرض المنتجات وإدارتها
- **لوحة تحكم احترافية** - إدارة المنتجات والطلبات والعملاء
- **مصادقة آمنة** - باستخدام Firebase Authentication
- **توافق الهاتف** - متجاوب (Responsive) على جميع الأجهزة
- **رسوم تنبيهات** - استخدام React Hot Toast
- **حركات سلسة** - استخدام Framer Motion للرسوم المتحركة

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- npm أو yarn

### التثبيت

```bash
# استنساخ المشروع
cd Saibes-Libya-Paint

# تثبيت الحزم
npm install

# إنشاء ملف البيئة
cp env.example .env.local

# ملء متغيرات Firebase في .env.local
```

### التشغيل

```bash
# تشغيل خادم التطوير
npm run dev

# سيتم فتح الموقع على http://localhost:5173
```

### البناء للإنتاج

```bash
# بناء المشروع
npm run build

# عرض المشروع المبني
npm run preview
```

## 📁 بنية المشروع

```
src/
├── components/          # المكونات المشتركة
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Footer.tsx
│   └── ...
├── pages/              # الصفحات
│   ├── HomePage.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── AdminLogin.tsx
│       └── ...
├── store/              # Zustand stores
│   ├── authStore.ts
│   └── cartStore.ts
├── types/              # TypeScript types
├── firebase.ts         # Firebase configuration
├── App.tsx             # التطبيق الرئيسي
└── main.tsx            # نقطة الدخول
```

## 🔐 إعدادات Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. أنشئ مشروعًا جديدًا
3. انسخ بيانات الاتصال
4. أضفها في `.env.local`
5. فعّل Firebase Authentication (Email/Password)

## 👤 حسابات الاختبار

### Admin Account
```
Email: admin@saibes.com
Password: admin123
```

## 📱 الصفحات الرئيسية

- **الصفحة الرئيسية** - عرض المنتجات والميزات
- **لوحة التحكم** - `/admin` - إدارة المتجر
- **تسجيل الدخول** - `/admin/login`

## 🛠️ المتغيرات البيئية

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## 📦 الحزم المستخدمة

- **React 18** - مكتبة JavaScript
- **React Router** - التوجيه
- **Firebase** - قاعدة البيانات والمصادقة
- **Tailwind CSS** - تصميم الواجهات
- **Framer Motion** - الرسوم المتحركة
- **Zustand** - إدارة الحالة
- **Lucide React** - الأيقونات
- **React Hot Toast** - الرسائل

## 🎨 التخصيص

### تغيير الألوان
عدّل `tailwind.config.js`:
```js
colors: {
  primary: "#1e3a8a",    // اللون الأساسي
  secondary: "#ffffff",   // اللون الثانوي
  accent: "#f59e0b",     // لون التمييز
}
```

### تغيير معلومات المتجر
عدّل بيانات المتجر في `src/components/Footer.tsx` و `src/components/ContactSection.tsx`

## 📞 التواصل والدعم

- **الهاتف**: +218 21 111 2222
- **البريد**: info@saibes-libya.com
- **العنوان**: طرابلس، ليبيا

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومرخص تحت MIT License

## 👨‍💻 المطور

تم تطويره باستخدام ❤️ في ليبيا 🇱🇾

---

**ملاحظة**: هذا نسخة تجريبية من المشروع. يرجى تحديث جميع البيانات والأسعار قبل النشر
