const { Telegraf, session } = require('telegraf');
const { BOT_TOKEN } = require('./config');
const fs = require('fs');


const bot = new Telegraf(BOT_TOKEN);

// Активируем использование сессий
bot.use(session());

// Обработчик команды /start
bot.command('start', (ctx) => {
    
    const keyboard = {
        inline_keyboard: [
            [{ text: 'Расчитать заказ', callback_data: 'usd' }],
            [{ text: 'Поддержка', callback_data: 'help' }]
        ]
    };

    
    ctx.reply(

        '*Привет!* Я бот-калькулятор для заказов с Китая от Димыча ( @mason_mzk ).\n' +
        'Вы сможете самостоятельно расчитать заказ, который предварительно сможете оценить перед оформлением заказа.\n' +
        '',
        
        { reply_markup: keyboard }
    );
});


// Обработчик команды /help
bot.command('help', (ctx) => {
    ctx.reply(
        'Если у вас возникли вопросы или вам нужна помощь, пожалуйста, свяжитесь со мной напрямую: @mason_mzk'
    );
});


// Обработчик нажатий на кнопку с выбором валюты USD
bot.action('usd', (ctx) => {
    // Проверяем, определено ли свойство session в контексте
    if (!ctx.session) {
        ctx.session = {}; // Если нет, инициализируем его
    }
    
    // Сохраняем выбранную валюту в сессии
    ctx.session.currency = 'usd';

    // Отправляем сообщение с запросом на ввод суммы
    ctx.reply('Теперь введите сумму вашего заказа в USD:');
});

// Обработчик ввода текста пользователем
bot.on('text', (ctx) => {
    // Проверяем, есть ли в сессии выбранная валюта и она равна 'usd'
    if (ctx.session.currency && ctx.session.currency === 'usd') {
        // Пробуем преобразовать введенный текст в число
        const orderAmount = parseFloat(ctx.message.text);

        // Проверяем, успешно ли преобразовался ввод в число
        if (!isNaN(orderAmount)) {
            // Вычисляем общую сумму заказа, добавляя маржу (пусть по умолчанию будет 13%)
            const marginPercent = 0.13; // 13%
            const totalAmount = orderAmount * (1 + marginPercent);

            // Отправляем сообщение с общей суммой заказа
            ctx.reply(`Сумма вашего заказа составит ${totalAmount.toFixed(2)} USD, как много $$$!`);
        } else {
            // Если ввод пользователя не является числом, отправляем сообщение об ошибке
            ctx.reply('Ошибка: введите корректное число для суммы заказа');
        }
    } else {
        // Если выбрана некорректная валюта или сессия не активирована, отправляем сообщение об ошибке
        ctx.reply('Ошибка: некорректная валюта или сессия не активирована');
    }
});





  
bot.launch();