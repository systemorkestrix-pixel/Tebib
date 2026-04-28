# Nouna Food

واجهة قائمة طعام مبنية بـ `Vite` مع صفحة عامة وصفحة إدارة (`/admin`) وتعتمد على `Supabase`.

## Structure

- `index.html`: الواجهة العامة
- `admin/index.html`: لوحة الإدارة
- `js/app.js`: منطق الواجهة العامة
- `admin/admin.js`: منطق لوحة الإدارة
- `scripts/setup-supabase.mjs`: تهيئة القاعدة الكاملة محليًا
- `migrations/20260425_create_site_settings.sql`: migration مستقلة لجدول الإعدادات
- `scripts/run-migration.mjs`: مشغّل migrations يدوي

## Environment Variables

انسخ `.env.example` إلى `.env` ثم أضف القيم التالية:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-anon-key"
SUPABASE_DB_URL="postgresql://postgres.your-project-ref:your-db-password@aws-0-region.pooler.supabase.com:6543/postgres"
```

- `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` مطلوبان محليًا وعلى `Vercel`.
- `SUPABASE_DB_URL` مطلوب فقط عند تشغيل تهيئة القاعدة أو migration يدويًا.

## Local Development

```bash
npm install
npm run dev
```

إذا أردت تشغيل التهيئة الكاملة محليًا:

```bash
npm run setup:db
```

## One-Time Migration

لإضافة جدول `site_settings` مرة واحدة فقط على قاعدة البيانات الحالية:

```bash
npm run migrate:site-settings
```

هذا الأمر:
- لا يعمل أثناء `build`
- لا يعمل أثناء النشر على `Vercel`
- يُشغَّل مرة واحدة فقط عند تجهيز القاعدة أو عند ترقية مشروع قديم

إذا كنت تفضل التشغيل اليدوي من Supabase SQL Editor، يمكنك تنفيذ الملف:

`migrations/20260425_create_site_settings.sql`

## Build

```bash
npm run build
```

المخرجات تُنشأ داخل `dist/`.

## Vercel Deployment

المشروع يُنشر كتطبيق `Vite` ثابت متعدد الصفحات. في `Vercel` استخدم:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

أضف في `Vercel`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

ولا تضف `SUPABASE_DB_URL` إلى `Vercel` إلا إذا كنت تحتاجه فعلًا في أوامر صيانة خاصة خارج البناء.
