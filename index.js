const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// إعدادات واجهة تيليجرام
const TELEGRAM_BOT_TOKEN = "8766489223:AAFZuFU-Y7ZYshi1PqB2P9rXnbosRyN7dhQ";
const TELEGRAM_CHAT_ID = "@HAPPYYEMEN2026";

// تهيئة عميل واتساب وحفظ الجلسة محلياً لعدم الحاجة لمسح الرمز مراراً
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // ضروري لعمل المتصفح في الخوادم السحابية
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

// إنشاء رمز QR في شاشة السجلات لربط رقمك
client.on('qr', (qr) => {
    console.log('[النظام]: يرجى مسح رمز QR التالي باستخدام تطبيق واتساب (الأجهزة المرتبطة):');
    qrcode.generate(qr, { small: true });
});

// تأكيد إتمام عملية الربط
client.on('ready', () => {
    console.log('[النظام]: تم ربط رقم الواتساب بنجاح! البوت جاهز للاستماع.');
});

// الاستماع الفوري لكل الرسائل الواردة والصادرة
client.on('message_create', async (msg) => {
    // تجاهل الرسائل الفارغة أو القصيرة جداً
    if (!msg.body || msg.body.length < 5) return;

    try {
        const chat = await msg.getChat();
        console.log(`[التقاط]: رسالة من (${chat.name || 'غير معروف'})`);

        // في هذه المرحلة سنقوم بإرسال جميع النصوص الطويلة إلى تيليجرام
        // لاحقاً يمكننا وضع شرط (if) مخصص لاسم القناة فقط بعد تشخيص السجلات
        if (msg.body.length > 20) {
            await sendToTelegram(msg.body);
        }
    } catch (err) {
        console.error('[خطأ أثناء معالجة الرسالة]:', err.message);
    }
});

// بدء التشغيل
client.initialize();
