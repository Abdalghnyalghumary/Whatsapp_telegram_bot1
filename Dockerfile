# 1. جلب نسخة خفيفة من نظام تشغيل يحتوي على بيئة Node.js
FROM node:18-bullseye-slim

# 2. تحديث النظام وتثبيت متصفح كروميوم (النسخة المفتوحة من كروم) الأساسي لعمل واتساب
RUN apt-get update && apt-get install -y chromium \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# 3. تحديد مجلد العمل داخل الخادم
WORKDIR /app

# 4. نسخ ملف الإعدادات لتثبيت المكتبات
COPY package.json ./

# 5. تثبيت المكتبات البرمجية المطلوبة
RUN npm install

# 6. نسخ كود البوت الخاص بك (index.js) إلى الخادم
COPY . .

# 7. الأمر النهائي لتشغيل البوت
CMD ["npm", "start"]
