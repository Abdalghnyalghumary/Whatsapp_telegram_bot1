const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// إعدادات واجهة تيليجرام
const TELEGRAM_BOT_TOKEN = "8766489223:AAFZuFU-Y7ZYshi1PqB2P9rXnbosRyN7dhQ";
const TELEGRAM_CHAT_ID = "@HAPPYYEMEN2026";

// تهيئة عميل واتساب برمجياً
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // إخبار الكود بالمسار الدقيق للمتصفح الذي قمنا بتثبيته عبر ملف Docker
        executablePath: '/usr/bin/chromium',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage' // أمر مهم لمنع امتلاء ذاكرة الخادم العشوائية
        ] 
    }
});

// دالة مخصصة لإرسال النصوص إلى تيليجرام
async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: text
        });
        console.log('[نجاح]: تم تمرير الرسالة إلى تيليجرام.');
    } catch (error) {
        console.error('[خطأ]: تعذر الاتصال بتيليجرام', error.message);
    }
}

// إنشاء رمز الاستجابة السريعة (QR) في شاشة السجلات
client.on('qr', (qr) => {
    console.log('\n==================================================');
    console.log('[النظام]: يرجى مسح رمز QR التالي باستخدام واتساب:');
    qrcode.generate(qr, { small: true });
    console.log('==================================================\n');
});

// تأكيد إتمام عملية الربط
client.on('ready', () => {
    console.log('[النظام]: تم ربط رقم الواتساب بنجاح! البوت جاهز ويستمع للرسائل.');
});

// الاستماع الفوري لكل الرسائل الواردة
client.on('message_create', async (msg) => {
    if (!msg.body || msg.body.length < 5) return;

    try {
        const chat = await msg.getChat();
        console.log(`[التقاط]: رسالة من (${chat.name || 'غير معروف'})`);

        // تصفية أولية لتمرير النصوص المناسبة فقط
        if (msg.body.length > 20) {
            await sendToTelegram(msg.body);
        }
    } catch (err) {
        console.error('[خطأ أثناء معالجة الرسالة]:', err.message);
    }
});

client.initialize();
