const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard, InputFile } = require('grammy');
require('dotenv').config();
const fs = require('fs');

// Инициализируем бота с токеном из переменных окружения
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

//СОЗДАЛИ МЕНЮ С КОМАНДАМИ В БОТЕ
bot.api.setMyCommands([
    {command: 'start', description: 'Запустить бота'},
]);

const managerChatId = '835352092'; //  managers id

// Фразы, которые будут "ловиться" ботом
const triggerPhrases = [
    'помощь',
    'срочно',
    'важно',
];


// Определяем обработчик команды /start
bot.command('start', async ctx => {

    const userId = ctx.from.id;
    const userName = ctx.from.first_name;
    const welcomeMessage = `Приветствую, ${userName}!\n\nЯ помогу тебе ответить на вопросы или свяжу с менеджером.\n\nВыбери интересующий вариант доставки:`;
    const photoUrl = './image.png'; // Замените на реальный URL

    // Создаем клавиатуру
    const startKeyboard = new Keyboard()
        .text('Доставка внутри Грузии').row()
        .text('Отправка в Грузию').row()
        .text('Отправка из Грузии').row()
        .text('Написать менеджеру').text('Адрес пункта на карте')


    try {
        await ctx.replyWithPhoto(new InputFile(photoUrl));
        await ctx.reply(welcomeMessage, {
            reply_markup: startKeyboard
        });
    } catch (error) {
        console.error('Error sending location:', error);
    }

    fs.readFile('usome.txt', 'utf-8', (err, data) => {
        fs.writeFile('usome.txt', data + '\n' + [ctx.message.from.id, ctx.message.from.first_name, ctx.message.from.username], (err, data) => {
            console.log('good');
        }); //записать в файл
    });

});
bot.hears('Доставка внутри Грузии', async (ctx) => {
    const text = '<b>Доставка внутри Грузии.</b>\n\nСтоимость отправки: 4 лари первый кг, далее 2 лари/кг.\n\nАдрес приема: Батуми, Канделаки, 2 (рядом с канатной дорогой)\n\nТелефон: +995555385982';

    const keyboard = new InlineKeyboard().url('Расчет стоимости доставки', 'https://cdek.ge/ru/cabinet/calculate/').row().url('Написать менеджеру', 'https://t.me/Cdek_batumi')

    try {
        await ctx.reply(text,
            {
                reply_markup: keyboard,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }
        );
    } catch (error) {
        console.error('Error sending location:', error);
    }
})

bot.hears('Отправка в Грузию', async (ctx) => {
    const text = 'Что необходимо отправить в Грузию?';

    const keyboard = new InlineKeyboard()
        .text('Документы', 'documentsToGeorgia').row()
        .text('Посылка', 'parselsToGeorgia')

        try {
            await ctx.reply(text,
                {
                    reply_markup: keyboard,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                }
            );
        } catch (error) {
            console.error('Error sending location:', error);
        }
})

bot.callbackQuery('documentsToGeorgia', async (ctx) => {

    const text = `<strong>Отправка документов в Грузию.</strong>\n\nДокументы не требуют какого-то особого таможенного оформления.\nПросто сайте их в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>\n\n<strong>Запрещено отправлять:</strong> удостоверения личности, ценные бумаги, деньги.\n<strong>Недопустимо</strong> прикладывать к документам что-то дополнительно (сувениры, ключи, фотографии и т.д.).`

    const keyboard = new InlineKeyboard()
        .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
        .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
        .text('Назад', 'backToGeorgia');


    await ctx.answerCallbackQuery();
    await ctx.editMessageText(text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });

})

bot.callbackQuery('parselsToGeorgia', async (ctx) => {

    const text = 'Вы выбрали отправку посылки в Грузию. Выберите тип отправления:';

    const keyboard = new InlineKeyboard()
        .text('Личное отправление', 'personalToGeorgia').row()
        .text('Интернет магазин', 'onlineStoreToGeorgia').row()
        .text('Коммерческая отправка', 'commercialToGeorgia').row()
        .text('Назад', 'backToGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

bot.callbackQuery('personalToGeorgia', async (ctx) => {

    const text = `<strong>Отправка личный вещей в Грузию.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nОформляется на русском и английском языке, все поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>`

    const keyboard = new InlineKeyboard()
        .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
        .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
        .text('Назад', 'backParselsToGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

bot.callbackQuery('onlineStoreToGeorgia', async (ctx) => {

    const text =  `<strong>Отправка в Грузию для Интернет Магазинов.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nОформляется на русском и английском языке, все поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\n<b>Обязательное требование</b> - наличие сайта с размещенными на нем отправляемыми товарами.\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>`;

    const keyboard = new InlineKeyboard()
    .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
    .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
    .text('Назад', 'backParselsToGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

bot.callbackQuery('commercialToGeorgia', async (ctx) => {

    const text = `<strong>Отправка в Грузию коммерческого груза.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nОформляется на русском и английском языке, все поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>`;

    const keyboard = new InlineKeyboard()
        .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
        .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
        .text('Назад', 'backParselsToGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

// Обработчик кнопки "Назад отправка в Грузию" из различных состояний
bot.callbackQuery('backToGeorgia', async (ctx) => {
    const text = 'Что необходимо отправить в Грузию?';

    const keyboard = new InlineKeyboard()
        .text('Документы', 'documentsToGeorgia')
        .row()
        .text('Посылка', 'parselsToGeorgia');

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });
});

bot.callbackQuery('backParselsToGeorgia', async (ctx) => {
    const text = 'Вы выбрали отправку посылки в Грузию. Выберите тип отправления:';

    const keyboard = new InlineKeyboard()
        .text('Личное отправление', 'personalToGeorgia').row()
        .text('Интернет магазин', 'onlineStoreToGeorgia').row()
        .text('Коммерческая отправка', 'commercialToGeorgia').row()
        .text('Назад', 'backToGeorgia');

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });
});

bot.hears('Отправка из Грузии', async (ctx) => {
    const text = `<strong>Отправка из Грузии.</strong>\n\n<b>Посылку</b> можно отправить в Россию, Беларусь, Армению, Казахстан, Молдову, Азербайджан, Индию, Грецию.\n\n<b>Документы</b> можно отправить в Россию, Беларусь, Армению, Казахстан, Киргизию, Молдову, Азербайджан, Узбекистан, Индию, Грецию.\n\n\Батуми, Канделаки, 2 +995555385982`

    const keyboard = new InlineKeyboard()
        .text('Документы', 'documentsFromGeorgia').row()
        .text('Посылка', 'parselsFromGeorgia')

    try {
        await ctx.reply(text,
            {
                reply_markup: keyboard,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }
        );
    } catch (error) {
        console.error('Error sending location:', error);
    }
})

bot.callbackQuery('documentsFromGeorgia', async (ctx) => {

    const text = `<strong>Отправка документов из Грузии.</strong>\n\nДокументы не требуют какого-то особого таможенного оформления.\nПросто сайте их в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a>\n\n<strong>Запрещено отправлять:</strong> удостоверения личности, ценные бумаги, деньги.\n<strong>Недопустимо</strong> прикладывать к документам что то дополнительно (сувениры, ключи, фотографии и т.д.).`;

    const keyboard = new InlineKeyboard()
        .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
        .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
        .text('Назад', 'backFromGeorgia');


    await ctx.answerCallbackQuery();
    await ctx.editMessageText(text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });

})

bot.callbackQuery('parselsFromGeorgia', async (ctx) => {

    const text = 'Вы выбрали отправку посылки из Грузии. Выберите тип отправления:';

    const keyboard = new InlineKeyboard()
        .text('Личное отправление', 'personalFromGeorgia').row()
        .text('Интернет магазин', 'onlineStoreFromGeorgia').row()
        .text('Коммерческая отправка', 'commercialFromGeorgia').row()
        .text('Назад', 'backFromGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

bot.callbackQuery('personalFromGeorgia', async (ctx) => {

    const text =  `<strong>Отправка личных вещей из Грузии.</strong>\n\nCдать посылку можно в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a>\n\nОфис в Батуми, Канделаки 2 (около канатной дороги АРГО)`;

    const keyboard = new InlineKeyboard()
        .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
        .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
        .text('Назад', 'backParselsFromGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

bot.callbackQuery('onlineStoreFromGeorgia', async (ctx) => {

    const text =  `<strong>Отправка из Грузии для Интернет Магазинов.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nВсе поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\n<b>Обязательное требование</b> - наличие сайта с размещенными на нем отправляемыми товарами.\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a> \n\nОфис в Батуми, Канделаки 2 (около канатной дороги АРГО)`;

    const keyboard = new InlineKeyboard()
    .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
    .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
    .text('Назад', 'backParselsFromGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

bot.callbackQuery('commercialFromGeorgia', async (ctx) => {

    const text = `<strong>Отправка коммерческого груза из Грузии.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nВсе поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a>\n\nОфис в Батуми, Канделаки 2 (около канатной дороги АРГО)`;

    const keyboard = new InlineKeyboard()
        .url('Расчет стоимости доставки.', 'https://cdek.ge/ru/cabinet/calculate/').row()
        .url('Написать менеджеру', 'https://t.me/Cdek_batumi').row()
        .text('Назад', 'backParselsFromGeorgia');

        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, {
            reply_markup: keyboard,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

})

bot.callbackQuery('backFromGeorgia', async (ctx) => {
    const text = `<strong>Отправка из Грузии.</strong>\n\n<b>Посылку</b> можно отправить в Россию, Беларусь, Армению, Казахстан, Молдову, Азербайджан, Индию, Грецию.\n\n<b>Документы</b> можно отправить в Россию, Беларусь, Армению, Казахстан, Киргизию, Молдову, Азербайджан, Узбекистан, Индию, Грецию.\n\n\Батуми, Канделаки, 2 +995555385982`;

    const keyboard = new InlineKeyboard()
        .text('Документы', 'documentsFromGeorgia').row()
        .text('Посылка', 'parselsFromGeorgia')

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });
});

bot.callbackQuery('backParselsFromGeorgia', async (ctx) => {
    const text = 'Вы выбрали отправку посылки из Грузии. Выберите тип отправления:';

    const keyboard = new InlineKeyboard()
        .text('Личное отправление', 'personalFromGeorgia').row()
        .text('Интернет магазин', 'onlineStoreFromGeorgia').row()
        .text('Коммерческая отправка', 'commercialFromGeorgia').row()
        .text('Назад', 'backFromGeorgia');

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });
});

bot.hears('Адрес пункта на карте', async (ctx) => {
    const latitude = 41.64633162638483;  // Замените на свою широту
    const longitude = 41.64648423085474; // Замените на свою долготу

    try {
        await ctx.replyWithLocation(latitude, longitude);
    } catch (error) {
        console.error('Error sending location:', error);
    }
})

bot.hears('Написать менеджеру', async (ctx) => {
    try {
        await ctx.reply(`<a href="https://t.me/Cdek_batumi">Кликните, чтобы перейти к чату с менеджером</a>`,
            { parse_mode: 'HTML', disable_web_page_preview: true }
        );
    } catch (error) {
        console.error('Error sending location:', error);
    }
})




bot.on('message', async (ctx) => {
    const messageText = ctx.message.text.toLowerCase();

    // Проверяем, содержит ли сообщение одну из заданных фраз
    if (triggerPhrases.some(phrase => messageText.includes(phrase))) {
        const user = ctx.from;
        const chatId = ctx.chat.id;
        const messageId = ctx.message.message_id;

        // Формируем текст для отправки менеджеру
        const forwardedMessage = `Сообщение от ${user.first_name} (@${user.username}):\n\n${ctx.message.text}`;

        try {
            // Отправляем сообщение менеджеру
            await bot.api.sendMessage(managerChatId, forwardedMessage);
            // Отправляем подтверждение пользователю
            await ctx.reply('Ваше сообщение отправлено менеджеру.');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});

bot.on('message:text', ctx => ctx.reply(`Вы написали: ${ctx.message.text}`));
// Запускаем бота
bot.start();
