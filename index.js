require('dotenv').config()
const Bot = require('node-telegram-bot-api');



console.log("Bot has been started .... ")


const bot = new Bot(process.env.KEY_TG, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
    // настроили в этом блоке работу с верверной частью
});


bot.onText(/\/start/, (msg) => {
    const id = msg.chat.id

    bot.sendPhoto(id, './img/start.jpg', {
        caption: 'Выбери нужный вариант доставки:'
    })
    const html = `
    <strong>Приветствую, ${msg.from.first_name}!</strong>
    \nЯ помогу тебе ответить на вопросы или свяжу с менеджером!
    `

    bot.sendMessage(id, html, {
        reply_markup: {
            keyboard: [
                ['Доставка внутри Грузии'],
                ['Отправка в Грузию'],
                ['Отправка из Грузии'],
                ['Написать менеджеру', 'Адрес пункта на карте'],
            ],
            //one_time_keyboard: true // скроет клавиатуру сразу после нажатия кнопки
        },
        parse_mode: 'HTML',
        disable_notification: true
    });
})

bot.on('message', (msg) => {

    const id = msg.chat.id

    if (msg.text === 'Доставка внутри Грузии') {

        bot.sendMessage(id, 'Доставка внутри Грузии.\n\nСтоимость отправки: 4 лари первый кг, далее 2 лари/кг.\n\nАдрес приема: Батуми, Канделаки, 2 (рядом с канатной дорогой)\n\nТелефон: +995555385982', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Расчет стоимости доставки.',
                            url: 'https://cdek.ge/ru/cabinet/calculate/'
                        }
                    ],
                    [
                        {
                            text: 'Написать менеджеру.',
                            url: 't.me/Cdek_batumi'
                        }
                    ],
                ]
            }
        })

    } else if (msg.text === 'Отправка в Грузию') {

        bot.sendMessage(id, 'Что необходимо отправить в Грузию?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Документы',
                            callback_data: 'documentsToGeorgia'
                        }
                    ],
                    [
                        {
                            text: 'Посылка',
                            callback_data: 'parselsToGeorgia'
                        }
                    ],
                ]
            }
        })

    } else if (msg.text == "Отправка из Грузии") {

        const htmlParsels = `<b>Посылку</b> можно отправить в Россию, Беларусь, Армению, Казахстан, Молдову, Азербайджан, Индию, Грецию.`
        const htmlDocuments = `<b>Документы</b> можно отправить в Россию, Беларусь, Армению, Казахстан, Киргизию, Молдову, Азербайджан, Узбекистан, Индию, Грецию.`

        bot.sendMessage(id, `<strong>Отправка из Грузии.</strong>\n\n${htmlParsels}\n\n${htmlDocuments}\n\nБатуми, Канделаки, 2 +995555385982`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Хочу отправить посылку',
                            callback_data: 'parselsFromGeorgia'
                        }
                    ],
                    [
                        {
                            text: 'Хочу отправить документы',
                            callback_data: 'documentsFromGeorgia'
                        }
                    ],

                ]
            },
            parse_mode: 'HTML'
        })

    } else if (msg.text === 'Написать менеджеру') {

        const html = `<a href="t.me/Cdek_batumi">Перейти в чат с менеджером ... </a>`

        bot.sendMessage(id, html, {
            parse_mode: 'HTML',
            disable_notification: true // сообщение приходит без оповещения
        });
        bot.sendContact(id, '+995555385982', 'Менеджер пункта')
    } else if (msg.text === 'Адрес пункта на карте') {

        bot.sendLocation(id, 41.64630384415994, 41.64648283852216)

    } else {
        // bot.sendMessage(id, 'Думаю, что ответить...')

    }
})


// ToGeorgia
bot.on('callback_query', (query) => {

    switch (query.data) {

        case 'parselsToGeorgia':

            bot.sendMessage(query.message.chat.id, 'Выбери тип посылки для отправки в Грузию:', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Личное отправление',
                                callback_data: 'ownToGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Интернет Магазин',
                                callback_data: 'imToGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Коммерческая отправка',
                                callback_data: 'comToGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editToGeorgia'
                            }
                        ],
                    ]
                }
            })
            break;

        case 'documentsToGeorgia':

            const htmlDocumentsToGeorgia = `<strong>Отправка документов в Грузию.</strong>\n\nДокументы не требуют какого-то особого таможенного оформления.\nПросто сайте их в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>\n\n<strong>Запрещено отправлять:</strong> удостоверения личности, ценные бумаги, деньги.\n <strong>Недопустимо</strong> прикладывать к документам что то дополнительно (сувениры, ключи, фотографии и т.д.).`

            bot.sendMessage(query.message.chat.id, htmlDocumentsToGeorgia, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Расчет стоимости доставки.',
                                url: 'https://cdek.ge/ru/cabinet/calculate/'
                            }
                        ],
                        [
                            {
                                text: 'Написать менеджеру',
                                url: 't.me/Cdek_batumi'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editToGeorgia'
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML',
            })
            break;
    }
})

//to Georgia parsels
bot.on('callback_query', (query) => {
    
    const {chat, message_id, text} = query.message

    switch (query.data) {

        

        case 'ownToGeorgia':

            const htmlownToGeorgia = `<strong>Отправка личный вещей в Грузию.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nОформляется на русском и английском языке, все поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>`

            bot.sendMessage(chat.id, htmlownToGeorgia, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Расчет стоимости доставки.',
                                url: 'https://cdek.ge/ru/cabinet/calculate/'
                            }
                        ],
                        [
                            {
                                text: 'Написать менеджеру',
                                url: 't.me/Cdek_batumi'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editParselsToGeorgia'
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML',
            })
            break;

        case 'imToGeorgia':

            const htmlimToGeorgia = `<strong>Отправка в Грузию для Интернет Магазинов.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nОформляется на русском и английском языке, все поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\n<b>Обязательное требование</b> - наличие сайта с размещенными на нем отправляемыми товарами.\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>`

            bot.sendMessage(chat.id, htmlimToGeorgia, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Расчет стоимости доставки.',
                                url: 'https://cdek.ge/ru/cabinet/calculate/'
                            }
                        ],
                        [
                            {
                                text: 'Написать менеджеру',
                                url: 't.me/Cdek_batumi'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editParselsToGeorgia'
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML',
            })
        break;

        case 'comToGeorgia':

        const htmlToGeorgia = `<strong>Отправка в Грузию коммерческого груза.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nОформляется на русском и английском языке, все поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории России.</a>`

        bot.sendMessage(chat.id, htmlToGeorgia, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Расчет стоимости доставки.',
                            url: 'https://cdek.ge/ru/cabinet/calculate/'
                        }
                    ],
                    [
                        {
                            text: 'Написать менеджеру',
                            url: 't.me/Cdek_batumi'
                        }
                    ],
                    [
                        {
                            text: 'Назад',
                            callback_data: 'editParselsToGeorgia'
                        }
                    ],
                ]
            },
            parse_mode: 'HTML',
        })
        break;

        case 'editToGeorgia':

            bot.editMessageText('Что необходимо отправить в Грузию?', {
                chat_id: chat.id,
                message_id: message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Документы',
                                callback_data: 'documentsToGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Посылка',
                                callback_data: 'parselsToGeorgia'
                            }
                        ],
                    ]
                }
            })
        break;
           
    }
})

bot.on('callback_query', (query) => {
    const {chat, message_id, text} = query.message

    switch(query.data) {
        case 'editParselsToGeorgia' :

            bot.editMessageText('Выбери тип посылки для отправки в Грузию:', {
                chat_id: chat.id,
                message_id: message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Личное отправление',
                                callback_data: 'ownToGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Интернет Магазин',
                                callback_data: 'imToGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Коммерческая отправка',
                                callback_data: 'comToGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editToGeorgia'
                            }
                        ],
                    ]
                }
            })
        break;
    }

})

//fromGeorgia
bot.on('callback_query', (query) => {

    const {chat, message_id, text} = query.message

    switch (query.data) {

        case 'parselsFromGeorgia':

            bot.sendMessage(chat.id, 'Выбери тип посылки для отправки из Грузии:', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Личное отправление',
                                callback_data: 'ownFromGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Интернет Магазин',
                                callback_data: 'imFromGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Коммерческая отправка',
                                callback_data: 'comFromGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editFromGeorgia'
                            }
                        ],
                    ]
                }
            })
            break;

        case 'documentsFromGeorgia':

            const htmlDocumentsFromGeorgia = `<strong>Отправка документов из Грузии.</strong>\n\nДокументы не требуют какого-то особого таможенного оформления.\nПросто сайте их в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a>\n\n<strong>Запрещено отправлять:</strong> удостоверения личности, ценные бумаги, деньги.\n<strong>Недопустимо</strong> прикладывать к документам что то дополнительно (сувениры, ключи, фотографии и т.д.).\n\n- заключить договор`

            bot.sendMessage(chat.id, htmlDocumentsFromGeorgia, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Расчет стоимости доставки.',
                                url: 'https://cdek.ge/ru/cabinet/calculate/'
                            }
                        ],
                        [
                            {
                                text: 'Написать менеджеру',
                                url: 't.me/Cdek_batumi'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editFromGeorgia'
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML',
            })
            break;
    }
})

//from Georgia parsels
bot.on('callback_query', (query) => {

    const {chat, message_id, text} = query.message

    switch (query.data) {

        case 'ownFromGeorgia':

            const htmlownFromGeorgia = `<strong>Отправка личных вещей из Грузии.</strong>\n\nCдать посылку можно в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a>\n\nОфис в Батуми, Канделаки 2 (около канатной дороги АРГО)`

            bot.sendMessage(chat.id, htmlownFromGeorgia, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Расчет стоимости доставки.',
                                url: 'https://cdek.ge/ru/cabinet/calculate/'
                            }
                        ],
                        [
                            {
                                text: 'Написать менеджеру',
                                url: 't.me/Cdek_batumi'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editParselsFromGeorgia'
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML',
            })
            break;

        case 'imFromGeorgia':

            const htmlimFromGeorgia = `<strong>Отправка из Грузии для Интернет Магазинов.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nВсе поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\n<b>Обязательное требование</b> - наличие сайта с размещенными на нем отправляемыми товарами.\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a> \n\nОфис в Батуми, Канделаки 2 (около канатной дороги АРГО)`

            bot.sendMessage(chat.id, htmlimFromGeorgia, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Расчет стоимости доставки.',
                                url: 'https://cdek.ge/ru/cabinet/calculate/'
                            }
                        ],
                        [
                            {
                                text: 'Написать менеджеру',
                                url: 't.me/Cdek_batumi'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editParselsFromGeorgia'
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML',
            })
        break;

        case 'comFromGeorgia':

        const htmlFromGeorgia = `<strong>Отправка коммерческого груза из Грузии.</strong>\n\n<a href="#">Oформить инвойс</a>.\n\nВсе поля обязательны для заполнения.\n\nКаждая единица вложения описывается отдельно с указанием материала, бренда, новые или было в употреблении, цены.\n\nПример: кроссовки Адидас, синтетика, Б/У, 100 долларов.\nИспользование общих формулировок, например: личные вещи – <b>недопустимо.</b>\n\nCдавать посылку и инвойс в любой <a href="https://www.cdek.ru/ru/offices/?utm_referrer=https%3A%2F%2Fyandex.ru%2F">офис СДЭК на территории Грузии.</a>\n\nОфис в Батуми, Канделаки 2 (около канатной дороги АРГО)`

        bot.sendMessage(chat.id, htmlFromGeorgia, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Расчет стоимости доставки.',
                            url: 'https://cdek.ge/ru/cabinet/calculate/'
                        }
                    ],
                    [
                        {
                            text: 'Написать менеджеру',
                            url: 't.me/Cdek_batumi'
                        }
                    ],
                    [
                        {
                            text: 'Назад',
                            callback_data: 'editParselsFromGeorgia'
                        }
                    ],
                ]
            },
            parse_mode: 'HTML',
        })
        break;

        case 'editFromGeorgia':

            const htmlParsels = `<strong>Посылку</strong> можно отправить в Россию, Беларусь, Армению, Казахстан, Молдову, Азербайджан, Индию, Грецию.`
            const htmlDocuments = `<strong>Документы</strong> можно отправить в Россию, Беларусь, Армению, Казахстан, Киргизию, Молдову, Азербайджан, Узбекистан, Индию, Грецию.`

            bot.editMessageText(`<strong>Отправка из Грузии.</strong>\n\n${htmlParsels}\n\n${htmlDocuments}\n\nБатуми, Канделаки, 2 +995555385982`, {
                chat_id: chat.id,
                message_id: message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Хочу отправить посылку',
                                callback_data: 'parselsFromGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Хочу отправить документы',
                                callback_data: 'documentsFromGeorgia'
                            }
                        ],

                    ]
                },
                parse_mode: 'HTML'
            })
        break;
    }
})

bot.on('callback_query', (query) => {
    const {chat, message_id, text} = query.message

    switch(query.data) {
        case 'editParselsFromGeorgia' :

            bot.editMessageText('Выбери тип посылки для отправки из Грузии:', {
                chat_id: chat.id,
                message_id: message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Личное отправление',
                                callback_data: 'ownFromGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Интернет Магазин',
                                callback_data: 'imFromGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Коммерческая отправка',
                                callback_data: 'comFromGeorgia'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'editFromGeorgia'
                            }
                        ],
                    ]
                }
            })
        break;
    }

})


/* 
bot.on('message', (msg) => {
    const { id } = msg.chat

    setTimeout(() => {
        bot.sendMessage(id, 'https://www.youtube.com/watch?v=sCE9CpJLpo8&list=PLhgRAQ8BwWFaxlkNNtO0NDPmaVO9txRg8&index=12', {
                disable_web_page_preview: true,
                disable_notification: true,
            })
    }, 4000)

    bot.sendMessage(id, 'https://www.youtube.com/watch?v=sCE9CpJLpo8&list=PLhgRAQ8BwWFaxlkNNtO0NDPmaVO9txRg8&index=12', {
        disable_web_page_preview: true
    })

*/

